import mongoose from "mongoose";
import File from "../modles/fileModel.js";
import mime from "mime-types";
import cloudinary from "../config/cloudinary.js";
import Quota from "../modles/quotaModel.js";
import Directory from "../modles/directoryModel.js";
import { ROLES } from "../rbac/permission.js";
import { attachFileUrls } from "../lib/cloudinaryUrlHelper.js";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

/**
 * Get file metadata and download link.
 */
export const getFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
    if (!isPrivileged && file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied to this file" });
    }

    return res.status(200).json(attachFileUrls(file));
  } catch (err) {
    next(err);
  }
};

/**
 * Upload a file to Cloudinary and create file record.
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const fileSize = req.file.size;

    if (fileSize > MAX_FILE_SIZE) {
      return res.status(413).json({
        success: false,
        message: "File size cannot exceed 15 MB",
      });
    }

    const parentDirId = req.params.id || req.user.rootDirId;

    // Validate parent directory
    if (parentDirId) {
      if (!mongoose.Types.ObjectId.isValid(parentDirId)) {
        return res.status(400).json({ success: false, message: "Invalid parent directory ID" });
      }

      const parentDir = await Directory.findById(parentDirId).lean();
      if (!parentDir) {
        return res.status(404).json({ success: false, message: "Target directory not found" });
      }

      const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
      if (!isPrivileged && parentDir.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied to target directory" });
      }
    }

    const quota = await Quota.findOne({ userId: req.user._id });
    if (!quota) {
      return res.status(404).json({
        success: false,
        message: "Storage quota not found",
      });
    }

    const remainingStorage = quota.storageLimit - quota.storageUsed;
    if (fileSize > remainingStorage) {
      return res.status(413).json({
        success: false,
        message: "Storage limit exceeded",
        storageLimit: quota.storageLimit,
        storageUsed: quota.storageUsed,
        remainingStorage,
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "storely",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(req.file.buffer);
    });

    const file = await File.create({
      name: req.file.originalname,
      extension: mime.extension(req.file.mimetype) || req.file.originalname.split(".").pop(),
      userId: req.user._id,
      parentDirId,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      size: fileSize,
    });

    // Update quota
    await Quota.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { storageUsed: fileSize } },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: attachFileUrls(file),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Rename an existing file.
 */
export const renameFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    if (!newName || !newName.trim()) {
      return res.status(400).json({ success: false, message: "New file name is required" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
    if (!isPrivileged && file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    file.name = newName.trim();
    await file.save();

    return res.status(200).json({
      success: true,
      message: "File renamed successfully",
      file: {
        id: file._id,
        name: file.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a file, remove Cloudinary asset, and decrement owner's quota.
 */
export const DeleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
    if (!isPrivileged && file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Delete from Cloudinary
    if (file.publicId) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType || "image",
        });
      } catch (e) {
        console.error(`Failed to delete Cloudinary file ${file.publicId}:`, e);
      }
    }

    // Decrement the FILE OWNER's storage usage (not necessarily caller's)
    await Quota.findOneAndUpdate(
      { userId: file.userId },
      { $inc: { storageUsed: -file.size } },
    );

    await file.deleteOne();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
