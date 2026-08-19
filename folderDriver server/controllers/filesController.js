import File from "../modles/fileModel.js";
import mime from "mime-types";
import cloudinary from "../config/cloudinary.js";
import Quota from "../modles/quotaModel.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        message: "File size cannot exceed 10 MB",
      });
    }

    const quota = await Quota.findOne({
      userId: req.user._id,
    });

    if (!quota) {
      return res.status(404).json({
        message: "Storage quota not found",
      });
    }

    const remainingStorage = quota.storageLimit - quota.storageUsed;

    if (fileSize > remainingStorage) {
      return res.status(413).json({
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

    // Create file record
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

    // Update user's storage usage
    await Quota.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        $inc: {
          storageUsed: fileSize,
        },
      },
      {
        new: true,
      },
    );

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

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });

    // Decrease user's storage usage
    await Quota.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        $inc: {
          storageUsed: -file.size,
        },
      },
    );

    // Delete database record
    await file.deleteOne();

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
