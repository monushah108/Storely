import File from "../modles/fileModel.js";
import mime from "mime-types";
import cloudinary from "../config/cloudinary.js";
import Quota from "../modles/qouteModel.js";

export const getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.status(200).json(file);
  } catch (err) {
    next(err);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file provided",
      });
    }
    const fileSize = req.file.size;
    const quota = await Quota.findOne({
      userId: req.user._id,
    });

    if (!quota) {
      return res.status(404).json({
        message: "Storage quota not found",
      });
    }

    // Calculate remaining storage
    const remainingStorage = quota.storageLimit - quota.storageUsed;

    // Check whether file fits
    if (fileSize > remainingStorage) {
      return res.status(413).json({
        message: "Storage limit exceeded",
        storageLimit: quota.storageLimit,
        storageUsed: quota.storageUsed,
        remainingStorage,
      });
    }
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
      extension: mime.extension(req.file.mimetype),
      userId: req.user._id,
      parentDirId: req.params.id || req.user.rootDirId,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      size: fileSize,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (err) {
    next(err);
  }
};

export const renameFile = async (req, res, next) => {
  try {
    const { newName } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    file.name = newName;

    await file.save();

    return res.status(200).json({
      message: "File renamed successfully",
      // file,
    });
  } catch (err) {
    next(err);
  }
};

export const DeleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });

    await file.deleteOne();

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
