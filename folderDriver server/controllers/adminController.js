import mongoose from "mongoose";
import Crypto from "crypto";
import AdminAccess from "../modles/adminAcessModel.js";
import Directory from "../modles/directoryModel.js";
import File from "../modles/fileModel.js";
import Quota from "../modles/quotaModel.js";
import Session from "../modles/SessionModel.js";
import User from "../modles/userModel.js";
import AdminCredential from "../modles/adminModel.js";
import { registerForm } from "../validators/adminRegisterForm.js";
import { canAssignRole, getRolePermissions, ROLES } from "../rbac/permission.js";
import cloudinary from "../config/cloudinary.js";

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Get all users visible to the authenticated admin/owner.
 * Owners see all users and admins.
 * Admins only see regular users.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const callerRole = req.user.role;
    const { role: requestedRole } = req.query;

    let roleFilter;
    if (callerRole === ROLES.OWNER) {
      if (requestedRole && [ROLES.USER, ROLES.ADMIN].includes(requestedRole)) {
        roleFilter = [requestedRole];
      } else {
        roleFilter = [ROLES.USER, ROLES.ADMIN];
      }
    } else {
      // Regular admins can only inspect standard users
      roleFilter = [ROLES.USER];
    }

    const allUsers = await User.find({
      deleted: false,
      role: { $in: roleFilter },
    })
      .select("_id name email role picture createdAt")
      .lean();

    // Use distinct for high performance instead of loading all session documents
    const activeUserIds = await Session.distinct("userId");
    const activeUserIdSet = new Set(activeUserIds.map((id) => id.toString()));

    const transformedUsers = allUsers.map(({ _id, name, email, role, picture, createdAt }) => ({
      id: _id,
      name,
      picture,
      email,
      role,
      createdAt,
      isLoggedIn: activeUserIdSet.has(_id.toString()),
    }));

    return res.status(200).json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout all sessions for a specific user.
 */
export const logoutUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const targetUser = await User.findById(userId).lean();
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Admins cannot log out an owner
    if (targetUser.role === ROLES.OWNER && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ success: false, message: "Cannot log out the owner" });
    }

    await Session.deleteMany({ userId });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete user.
 */
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (req.user._id.toString() === userId) {
      return res.status(403).json({ success: false, message: "You cannot delete your own account" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser.role === ROLES.OWNER) {
      return res.status(403).json({ success: false, message: "The owner account cannot be deleted" });
    }

    if (targetUser.role === ROLES.ADMIN && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ success: false, message: "Only the owner can delete an admin account" });
    }

    await Session.deleteMany({ userId });
    targetUser.deleted = true;
    await targetUser.save();

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * Hard delete user and all associated resources.
 */
export const hardDeleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (req.user._id.toString() === userId) {
      return res.status(403).json({ success: false, message: "You cannot delete your own account" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser.role === ROLES.OWNER) {
      return res.status(403).json({ success: false, message: "The owner account cannot be deleted" });
    }

    // Clean up Cloudinary files
    const files = await File.find({ userId }).select("publicId resourceType").lean();
    for (const f of files) {
      if (f.publicId) {
        try {
          await cloudinary.uploader.destroy(f.publicId, {
            resource_type: f.resourceType || "image",
          });
        } catch (e) {
          console.error(`Failed to delete Cloudinary asset ${f.publicId}:`, e);
        }
      }
    }

    await File.deleteMany({ userId });
    await Directory.deleteMany({ userId });
    await Session.deleteMany({ userId });
    await Quota.deleteOne({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * Get all soft-deleted users.
 */
export const DeletedUser = async (req, res, next) => {
  try {
    const callerRole = req.user.role;
    const roleFilter =
      callerRole === ROLES.OWNER ? [ROLES.USER, ROLES.ADMIN] : [ROLES.USER];

    const deletedUsers = await User.find({
      deleted: true,
      role: { $in: roleFilter },
    })
      .select("_id name email role picture createdAt")
      .lean();

    const activeUserIds = await Session.distinct("userId");
    const activeUserIdSet = new Set(activeUserIds.map((id) => id.toString()));

    const transformedUsers = deletedUsers.map(({ _id, name, email, role, picture, createdAt }) => ({
      id: _id,
      name,
      email,
      role,
      picture,
      createdAt,
      isLoggedIn: activeUserIdSet.has(_id.toString()),
    }));

    return res.status(200).json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Recover a soft-deleted user.
 */
export const RecoverUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (targetUser.role === ROLES.ADMIN && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ success: false, message: "Only the owner can recover an admin account" });
    }

    targetUser.deleted = false;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "User has been recovered successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Search users by email or name using database-level regex.
 */
export const SearchUser = async (req, res, next) => {
  try {
    const query = req.query.query || req.query.email || "";

    if (!query.trim()) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const callerRole = req.user.role;
    const roleFilter =
      callerRole === ROLES.OWNER ? [ROLES.USER, ROLES.ADMIN] : [ROLES.USER];

    const users = await User.find({
      deleted: false,
      role: { $in: roleFilter },
      $or: [
        { email: { $regex: query.trim(), $options: "i" } },
        { name: { $regex: query.trim(), $options: "i" } },
      ],
    })
      .select("_id name email role picture createdAt")
      .lean();

    const activeUserIds = await Session.distinct("userId");
    const activeUserIdSet = new Set(activeUserIds.map((id) => id.toString()));

    const searchedUsers = users.map(({ _id, name, email, role, picture, createdAt }) => ({
      id: _id,
      name,
      email,
      role,
      picture,
      createdAt,
      isLoggedIn: activeUserIdSet.has(_id.toString()),
    }));

    return res.status(200).json(searchedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Explore a user's files and folders from an admin viewpoint.
 */
export const FileExpoler = async (req, res, next) => {
  const { userId, dirId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const targetUser = await User.findById(userId).lean();
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Admins cannot explore owner files
    if (targetUser.role === ROLES.OWNER && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ error: "Access denied" });
    }

    let parentDirId = dirId;
    if (!parentDirId) {
      parentDirId = targetUser.rootDirId;
    }

    const directories = await Directory.find({ parentDirId }).lean();
    const files = await File.find({ parentDirId }).lean();

    return res.json({ file: files, directory: directories });
  } catch (err) {
    next(err);
  }
};

export const fileExplorer = FileExpoler;

/**
 * Update user role with privilege escalation prevention.
 */
export const updateRoles = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    const callerId = req.user._id.toString();
    const callerRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (callerId === userId) {
      return res.status(403).json({ message: "You cannot change your own role" });
    }

    if (!newRole || ![ROLES.USER, ROLES.ADMIN].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role === ROLES.OWNER) {
      return res.status(403).json({ message: "The owner role cannot be changed" });
    }

    // Enforce role assignment hierarchy
    if (!canAssignRole(callerRole, newRole)) {
      return res.status(403).json({
        message: "You do not have permission to assign this role",
      });
    }

    targetUser.role = newRole;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Role changed successfully",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// ADMIN PROFILE
// ========================================

/**
 * Get current admin's profile and permissions.
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const permissions = getRolePermissions(user.role);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
      permissions,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// ADMIN ACCESS TOKENS & CREDENTIALS
// ========================================

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
    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can grant admin access",
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

    // Check if credential already exists; update or create
    let credential = await AdminCredential.findOne({ ownerId });
    if (credential) {
      credential.password = password;
      await credential.save();
    } else {
      await AdminCredential.create({
        ownerId,
        password,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Admin credentials created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCredentials = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update admin credentials",
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

    const credential = await AdminCredential.findOne({ ownerId });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Admin credential not found. Please create one first.",
      });
    }

    credential.password = password;
    await credential.save();

    // Revoke existing access links
    await AdminAccess.deleteMany({ ownerId });

    return res.status(200).json({
      success: true,
      message: "Admin credential updated successfully",
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

export const generateAccessToken = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can generate admin access tokens",
      });
    }

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
        usedAt: null,
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

    const credential = await AdminCredential.findOne({
      ownerId: access.ownerId,
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Admin credential not configured",
      });
    }

    const isValid = await credential.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password",
      });
    }

    access.usedAt = new Date();
    await access.save();

    res.cookie("admin_access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
      access: user.role === ROLES.ADMIN || user.role === ROLES.OWNER ? "granted" : "pending",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("admin_access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
