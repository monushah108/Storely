import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Directory from "../modles/directoryModel.js";
import File from "../modles/fileModel.js";
import { ROLES } from "../rbac/permission.js";

/**
 * Get directory contents (subdirectories and files) with metadata.
 */
export const getDirectory = async (req, res, next) => {
  try {
    const user = req.user;
    const _id = req.params.id || user.rootDirId?.toString();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid directory ID" });
    }

    const directory = await Directory.findById(_id).lean();
    if (!directory) {
      return res.status(404).json({ success: false, message: "Directory not found" });
    }

    // Ownership check: regular users can only access their own directories
    const isPrivileged = user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
    if (!isPrivileged && directory.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied to this directory" });
    }

    const directories = await Directory.find({ parentDirId: _id }).lean();
    const files = await File.find({ parentDirId: _id }).lean();

    const directoriesWithDetails = await Promise.all(
      directories.map(async (dir) => {
        const subDirCount = await Directory.countDocuments({ parentDirId: dir._id });
        const subFiles = await File.find({ parentDirId: dir._id }).select("size").lean();
        const subFileCount = subFiles.length;
        const totalSize = subFiles.reduce((acc, f) => acc + (f.size || 0), 0);
        const createdDate =
          dir.createdAt ||
          new Date(parseInt(dir._id.toString().substring(0, 8), 16) * 1000);
        return {
          ...dir,
          type: "directory",
          id: dir._id,
          itemCount: subDirCount + subFileCount,
          subDirCount,
          subFileCount,
          size: totalSize,
          createdAt: createdDate,
          updatedAt: dir.updatedAt || createdDate,
        };
      }),
    );

    const filesWithDetails = files.map((f) => {
      const createdDate =
        f.createdAt ||
        new Date(parseInt(f._id.toString().substring(0, 8), 16) * 1000);
      return {
        ...f,
        type: "file",
        id: f._id,
        createdAt: createdDate,
        updatedAt: f.updatedAt || createdDate,
      };
    });

    const rootCreated =
      directory.createdAt ||
      new Date(parseInt(directory._id.toString().substring(0, 8), 16) * 1000);
    const rootTotalSize = filesWithDetails.reduce((acc, f) => acc + (f.size || 0), 0);

    return res.status(200).json({
      ...directory,
      createdAt: rootCreated,
      updatedAt: directory.updatedAt || rootCreated,
      itemCount: directoriesWithDetails.length + filesWithDetails.length,
      subDirCount: directoriesWithDetails.length,
      subFileCount: filesWithDetails.length,
      size: rootTotalSize,
      directories: directoriesWithDetails,
      files: filesWithDetails,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Rename a directory.
 */
export const renameDirectory = async (req, res, next) => {
  const _id = req.params.id;
  const name = req.body.newName;

  try {
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid directory ID" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "New directory name is required" });
    }

    const directory = await Directory.findById(_id);
    if (!directory) {
      return res.status(404).json({ success: false, message: "Directory not found" });
    }

    const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
    if (!isPrivileged && directory.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    directory.name = name.trim();
    await directory.save();

    return res.status(200).json({
      success: true,
      message: "Directory has been renamed",
      directory: {
        id: directory._id,
        name: directory.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new subdirectory.
 */
export const createDirectory = async (req, res, next) => {
  const name = req.body.folderName;
  const userId = req.user._id;
  const parentDirId = req.params.id || req.user.rootDirId;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Folder name is required" });
    }

    if (parentDirId && !mongoose.Types.ObjectId.isValid(parentDirId)) {
      return res.status(400).json({ success: false, message: "Invalid parent directory ID" });
    }

    // Verify parent directory exists
    if (parentDirId) {
      const parentDir = await Directory.findById(parentDirId).lean();
      if (!parentDir) {
        return res.status(404).json({ success: false, message: "Parent directory not found" });
      }

      const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
      if (!isPrivileged && parentDir.userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Access denied to parent directory" });
      }
    }

    const directory = await Directory.create({
      name: name.trim(),
      userId,
      parentDirId: parentDirId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Directory has been created",
      directory,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Recursively delete a directory and all contained files/subdirectories.
 */
export const deleteDirectory = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid directory ID" });
    }

    const directoryData = await Directory.findById(id).lean();
    if (!directoryData) {
      return res.status(404).json({ success: false, error: "Directory not found!" });
    }

    // Protect root directory from deletion
    if (
      !directoryData.parentDirId ||
      directoryData._id.toString() === req.user.rootDirId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Root directory cannot be deleted.",
      });
    }

    const isPrivileged = req.user.role === ROLES.ADMIN || req.user.role === ROLES.OWNER;
    if (!isPrivileged && directoryData.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    async function getDirectoryContents(dirId) {
      let files = await File.find({ parentDirId: dirId })
        .select("_id publicId resourceType")
        .lean();

      let directories = await Directory.find({ parentDirId: dirId })
        .select("_id")
        .lean();

      for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } =
          await getDirectoryContents(_id);

        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
      }

      return { files, directories };
    }

    const { files, directories } = await getDirectoryContents(id);

    // Delete Cloudinary assets
    for (const { publicId, resourceType } of files) {
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType || "image",
          });
        } catch (e) {
          console.error(`Failed to delete Cloudinary asset ${publicId}:`, e);
        }
      }
    }

    await File.deleteMany({
      _id: { $in: files.map(({ _id }) => _id) },
    });

    await Directory.deleteMany({
      _id: { $in: [...directories.map(({ _id }) => _id), id] },
    });

    return res.status(200).json({
      success: true,
      message: "Directory and contents deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
