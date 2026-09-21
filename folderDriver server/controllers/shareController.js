import Share from "../modles/shareModel.js";
import crypto from "crypto";
import File from "../modles/fileModel.js";
import Directory from "../modles/directoryModel.js";

export const getToken = async (req, res, next) => {
  const fileId = req.params.id;
  const userId = req.user._id;

  try {
    const isTokenAlreadyExist = await Share.findOne({ userId, fileId });

    if (isTokenAlreadyExist) {
      return res.status(200).json(isTokenAlreadyExist);
    }

    const token = crypto.randomBytes(8).toString("hex");
    const link = await Share.create({
      userId,
      fileId,
      token,
    });

    return res.status(201).json(link);
  } catch (err) {
    next(err);
  }
};

export const getSharedfile = async (req, res, next) => {
  const token = req.params.id;

  try {
    const share = await Share.findOne({ token });

    if (!share) {
      return res.status(404).json({
        message: "This link is invalid or expired",
      });
    }

    const isValidToken = share.verifyToken(token);

    if (!isValidToken) {
      return res.status(404).json({
        message: "This link is invalid or expired",
      });
    }

    // 1. Try finding as File
    const file = await File.findById(share.fileId).populate(
      "userId",
      "picture name",
    );

    if (file) {
      const fileObj = file.toObject();
      const createdDate =
        fileObj.createdAt ||
        new Date(parseInt(fileObj._id.toString().substring(0, 8), 16) * 1000);
      return res.status(200).json({
        ...fileObj,
        itemType: "file",
        createdAt: createdDate,
        updatedAt: fileObj.updatedAt || createdDate,
      });
    }

    // 2. Try finding as Directory
    const directory = await Directory.findById(share.fileId)
      .populate("userId", "picture name")
      .lean();

    if (directory) {
      const directories = await Directory.find({ parentDirId: directory._id }).lean();
      const files = await File.find({ parentDirId: directory._id }).lean();

      const directoriesWithDetails = await Promise.all(
        directories.map(async (d) => {
          const subDirCount = await Directory.countDocuments({ parentDirId: d._id });
          const subFiles = await File.find({ parentDirId: d._id }).select("size").lean();
          const subSize = subFiles.reduce((acc, f) => acc + (f.size || 0), 0);
          const dCreated =
            d.createdAt ||
            new Date(parseInt(d._id.toString().substring(0, 8), 16) * 1000);
          return {
            ...d,
            type: "directory",
            id: d._id,
            itemCount: subDirCount + subFiles.length,
            size: subSize,
            createdAt: dCreated,
            updatedAt: d.updatedAt || dCreated,
          };
        }),
      );

      const filesWithDetails = files.map((f) => {
        const fCreated =
          f.createdAt ||
          new Date(parseInt(f._id.toString().substring(0, 8), 16) * 1000);
        return {
          ...f,
          type: "file",
          id: f._id,
          createdAt: fCreated,
          updatedAt: f.updatedAt || fCreated,
        };
      });

      const dirCreated =
        directory.createdAt ||
        new Date(parseInt(directory._id.toString().substring(0, 8), 16) * 1000);
      const totalFolderSize = filesWithDetails.reduce((acc, f) => acc + (f.size || 0), 0);

      return res.status(200).json({
        ...directory,
        itemType: "directory",
        isFolder: true,
        createdAt: dirCreated,
        updatedAt: directory.updatedAt || dirCreated,
        itemCount: directoriesWithDetails.length + filesWithDetails.length,
        size: totalFolderSize,
        directories: directoriesWithDetails,
        files: filesWithDetails,
      });
    }

    return res.status(410).json({
      message: "The resource you are looking for has been deleted by the owner",
    });
  } catch (err) {
    next(err);
  }
};

export const getUserShares = async (req, res, next) => {
  try {
    const shares = await Share.find({ userId: req.user._id })
      .sort({ _id: -1 })
      .lean();

    const results = await Promise.all(
      shares.map(async (share) => {
        const file = await File.findById(share.fileId).lean();
        if (file) {
          const createdDate =
            file.createdAt ||
            new Date(parseInt(file._id.toString().substring(0, 8), 16) * 1000);
          return {
            ...share,
            item: {
              ...file,
              createdAt: createdDate,
              updatedAt: file.updatedAt || createdDate,
            },
            itemType: "file",
          };
        }

        const directory = await Directory.findById(share.fileId).lean();
        if (directory) {
          const subDirCount = await Directory.countDocuments({ parentDirId: directory._id });
          const subFiles = await File.find({ parentDirId: directory._id }).select("size").lean();
          const totalSize = subFiles.reduce((acc, f) => acc + (f.size || 0), 0);
          const createdDate =
            directory.createdAt ||
            new Date(parseInt(directory._id.toString().substring(0, 8), 16) * 1000);
          return {
            ...share,
            item: {
              ...directory,
              itemCount: subDirCount + subFiles.length,
              subDirCount,
              subFileCount: subFiles.length,
              size: totalSize,
              createdAt: createdDate,
              updatedAt: directory.updatedAt || createdDate,
            },
            itemType: "directory",
          };
        }

        return null;
      }),
    );

    return res.status(200).json(results.filter(Boolean));
  } catch (err) {
    next(err);
  }
};

export const deleteShare = async (req, res, next) => {
  try {
    const share = await Share.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!share) {
      return res.status(404).json({ message: "Share link not found" });
    }

    return res.status(200).json({ message: "Share link revoked successfully" });
  } catch (err) {
    next(err);
  }
};
