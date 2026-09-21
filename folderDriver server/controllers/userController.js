import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import User from "../modles/userModel.js";
import Session from "../modles/SessionModel.js";
import Directory from "../modles/directoryModel.js";
import Quota from "../modles/quotaModel.js";
import form from "../validators/form.js";

/**
 * Register a new user account.
 */
export const register = async (req, res, next) => {
  const { data, success, error } = form.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      errors: error.flatten()?.fieldErrors,
    });
  }

  const { name, email, password } = data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "This email already exists",
        message: "A user with this email address already exists. Please try logging in.",
      });
    }

    const session = await mongoose.startSession();

    try {
      const rootDirId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const hashedPassword = await bcrypt.hash(password, 12);

      session.startTransaction();

      await Directory.create(
        [
          {
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId,
          },
        ],
        { session },
      );

      await User.create(
        [
          {
            _id: userId,
            name,
            email,
            password: hashedPassword,
            rootDirId,
            role: "user",
          },
        ],
        { session },
      );

      await Quota.create(
        [
          {
            userId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      throw txErr;
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "This email already exists",
        message: "A user with this email address already exists.",
      });
    }
    next(err);
  }
};

/**
 * Log in with email and password.
 */
export const login = async (req, res, next) => {
  try {
    const { data, success, error } = form.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.flatten()?.fieldErrors,
      });
    }

    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    if (user.deleted) {
      return res.status(403).json({
        success: false,
        error: "Your account has been deactivated. Please contact an administrator to recover it.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Limit concurrent sessions to 2
    const allSessions = await Session.find({ userId: user._id }).sort({ _id: 1 });
    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }

    const session = await Session.create({
      userId: user._id,
      rootDirId: user.rootDirId,
    });

    res.cookie("sid", session._id, {
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log out user by invalidating session.
 */
export const logout = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;

    if (sid && mongoose.Types.ObjectId.isValid(sid)) {
      await Session.findByIdAndDelete(sid);
    }

    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile and quota usage.
 */
export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let quota = await Quota.findOne({ userId: req.user._id }).lean();
    if (!quota) {
      // Auto-create quota if missing
      quota = await Quota.create({ userId: req.user._id });
    }

    const storagePer =
      quota.storageLimit > 0
        ? Number(((quota.storageUsed / quota.storageLimit) * 100).toFixed(1))
        : 0;

    return res.status(200).json({
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
      storage: {
        used: quota.storageUsed,
        limit: quota.storageLimit,
        remaining: Math.max(0, quota.storageLimit - quota.storageUsed),
        percentage: storagePer,
      },
    });
  } catch (err) {
    next(err);
  }
};
