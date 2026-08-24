import AdminAccess from "../modles/adminAcessModel.js";
import Directory from "../modles/directoryModel.js";
import File from "../modles/fileModel.js";
import Quota from "../modles/quotaModel.js";
import Session from "../modles/SessionModel.js";
import User from "../modles/userModel.js";
import Crypto from "crypto";
import { registerForm } from "../validators/adminRegisterForm.js";
import AdminCredential from "../modles/adminModel.js";

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
  const transformedUsers = allusers.map(
    ({ _id, name, email, role, picture }) => ({
      id: _id,
      name,
      picture,
      email,
      role,
      isLoggedIn: allSessionUserIdSet.has(_id.toString()),
    }),
  );
  return res.status(200).json(transformedUsers);
};

export const logoutUser = async (req, res, next) => {
  const { userId } = req.params;

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

export const getAdminCredentials = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const credential = await AdminCredential.findOne({ ownerId })
      .select("_id createdAt updatedAt")
      .lean();

    const access = await AdminAccess.findOne({ ownerId })
      .select("token expiresAt")
      .lean();

    const isActive = access && new Date(access.expiresAt) > new Date();
    return res.status(200).json({
      success: true,

      hasPassword: !!credential,

      accessToken: isActive
        ? {
            active: true,
            url: `/admin/verify/${access.token}`,
            expiresAt: access.expiresAt,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminAccess = async (req, res, next) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owner can grant admin access",
      });
    }

    const { data, success, error } = registerForm.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    const { password } = data;
    const ownerId = req.user._id;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Create new credential
    await AdminCredential.create({
      ownerId,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Admin access created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const clearAdminAccessToken = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const access = await AdminAccess.findOneAndDelete({ ownerId });

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "No active admin access token found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin access token revoked successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = req.user;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    const { data, success, error } = registerForm.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    const { password } = data;

    // ========================================
    // FIND ACCESS TOKEN
    // ========================================

    const access = await AdminAccess.findOne({
      token,
      usedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Admin access expired or invalid",
      });
    }

    // ========================================
    // FIND ADMIN CREDENTIAL
    // ========================================

    const credential = await AdminCredential.findOne({
      ownerId: access.ownerId,
    }).select("+password");

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Admin credential not found",
      });
    }

    // ========================================
    // VERIFY PASSWORD
    // ========================================

    const isValid = await credential.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password",
      });
    }

    // ========================================
    // GRANT ADMIN ROLE
    // ========================================

    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     role: "admin",
    //   },
    //   {
    //     new: true,
    //   },
    // );

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // ========================================
    // MARK TOKEN AS USED
    // ========================================

    access.usedAt = new Date();

    await access.save();

    // ========================================
    // CREATE ADMIN SESSION
    // ========================================

    res.cookie("admin_access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      access: user.role == "admin" ? "granted" : "pending",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("admin_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCredentials = async (req, res, next) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owner can update admin credentials",
      });
    }

    const { userId } = req.params;

    const { data, success, error } = registerForm.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    const { password } = data;

    const credential = await AdminCredential.findOne({
      userId,
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Admin credential not found",
      });
    }

    credential.password = password;

    // pre("save") will hash it
    await credential.save();

    // Revoke existing access links/sessions
    await AdminAccess.deleteMany({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Admin credential updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateAccessToken = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { expiryDate = 7 } = req.body;

    const token = Crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expiryDate));

    await AdminAccess.findOneAndUpdate(
      { ownerId },
      {
        ownerId,
        token,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(201).json({
      success: true,
      token,
      accessUrl: `/admin/verify/${token}`,
      expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdminToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Token is required",
      });
    }

    const tokenValid = await AdminAccess.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenValid) {
      return res.status(403).json({
        success: false,
        valid: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      message: "Valid token",
    });
  } catch (error) {
    next(error);
  }
};
