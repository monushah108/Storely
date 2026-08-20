import User from "../modles/userModel.js";
import Session from "../modles/SessionModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../modles/directoryModel.js";
import File from "../modles/fileModel.js";

import form from "../validators/form.js";
import sanitize from "sanitize-html";
import Quota from "../modles/quotaModel.js";

export const register = async (req, res, next) => {
  const { data, success, error } = form.safeParse(req.body);

  if (!success) {
    return res.status(400).json(error.flatten()?.fieldErrors);
  }

  const { name, email, password } = data;

  const session = await mongoose.startSession();

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    session.startTransaction();

    await Directory.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session },
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password,
        rootDirId,
      },
      { session },
    );

    await Quota.insertOne(
      {
        userId,
      },
      { session },
    );

    session.commitTransaction();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    session.abortTransaction();

    if (err.code === 121) {
      return res.status(400).json({
        error: "Validation Error",
      });
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(409).json({
          error: "This email already exists",
          message:
            "A user with this email address already exists. Please try logging in or use a different email.",
        });
      }
    } else {
      next(err);
    }
  }
};

export const login = async (req, res, next) => {
  const { data, success, error } = form.safeParse(req.body);
  if (!success) {
    return res.status(400).json(error.flatten()?.fieldErrors);
  }

  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  if (user.deleted) {
    return res.status(403).json({
      error: "your account has been deleted. Contact app admin to recover ",
    });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const allSessions = await Session.find({ userId: user._id });

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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: "logged in" });
};

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);

  res.clearCookie("sid");
  res.status(204).json({ message: "logout" });
};

export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();

    const quota = await Quota.findOne({
      userId: req.user._id,
    }).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!quota) {
      return res.status(404).json({
        message: "Storage quota not found",
      });
    }

    const storagePer =
      quota.storageLimit > 0
        ? Number(((quota.storageUsed / quota.storageLimit) * 100).toFixed(1))
        : 0;
    res.status(200).json({
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,

      storage: {
        used: quota.storageUsed,
        limit: quota.storageLimit,
        remaining: quota.storageLimit - quota.storageUsed,
        percentage: storagePer,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const selectedUser = role == "owner" ? ["user", "admin"] : ["user"];
  const allusers = await User.find({
    deleted: false,
    role: { $in: selectedUser },
  }).lean();
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const transformedUsers = allusers.map(({ _id, name, email, role }) => ({
    id: _id,
    name,
    email,
    role,
    isLoggedIn: allSessionUserIdSet.has(_id.toString()),
  }));
  return res.status(200).json(transformedUsers);
};

export const logoutUser = async (req, res, next) => {
  const { userId } = req.params;
  // const clean = sanitize(userId.toString())
  console.log(userId);

  try {
    await Session.deleteMany({ userId });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await Session.deleteMany({ userId });

    await User.findByIdAndUpdate(userId, { deleted: true });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const hardDeleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    await Session.deleteMany({ userId });
    await Directory.deleteMany({ userId });
    await Quota.deleteOne({ userId });

    const file = await File.find({ userId }).lean();

    await File.deleteMany({ userId });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const DeletedUser = async (req, res, next) => {
  const allusers = await User.find({
    deleted: true,
    role: { $in: ["user", "manager"] },
  }).lean();
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const transformedUsers = allusers.map(({ _id, name, email, role }) => ({
    id: _id,
    name,
    email,
    role,
    isLoggedIn: allSessionUserIdSet.has(_id.toString()),
  }));
  return res.status(200).json(transformedUsers);
};

export const RecoverUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { deleted: false },
      { new: true },
    );

    res.status(201).json({ message: "User has been recovered successfully" });
  } catch (err) {
    next(err);
  }
};

export const SearchUser = async (req, res, next) => {
  const { query: email } = req.query;

  const user = await User.find({
    deleted: false,
    role: { $in: ["user", "manager"] },
  })
    .select("-__v")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const searchedUser = user
    .filter(
      (user) => user.email.toLocaleLowerCase() == email.toLocaleLowerCase(),
    )
    .map(({ _id, name, email, role }) => ({
      id: _id,
      name,
      email,
      role,
      isLoggedIn: allSessionUserIdSet.has(_id.toString()),
    }));

  res.status(201).json(searchedUser);
};

export const FileExpoler = async (req, res, next) => {
  const { userId, dirId } = req.params;

  try {
    // decide which parent directory we need to query
    let parentDirId = dirId;

    if (!parentDirId) {
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      parentDirId = user.rootDirId;
    }

    const directories = await Directory.find({ parentDirId }).lean();
    const files = await File.find({ parentDirId }).lean();

    res.json({ file: files, directory: directories });
  } catch (err) {
    next(err);
  }
};

export const updateRoles = async (req, res) => {
  const { userId } = req.params;
  const extistingUser = req.user._id.toString();
  const { newRole } = req.body;
  if (extistingUser === userId) {
    return res
      .status(403)
      .json({ message: "you cannot change your role only owner can do!!" });
  }

  await User.findByIdAndUpdate(userId, { role: newRole });

  return res.status(201).json({ message: "role Changed successfully" });
};
