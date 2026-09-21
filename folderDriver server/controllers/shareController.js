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
      return res.status(200).json({
        ...file.toObject(),
        itemType: "file",
      });
    }

    // 2. Try finding as Directory
    const directory = await Directory.findById(share.fileId)
      .populate("userId", "picture name")
      .lean();

    if (directory) {
      const directories = await Directory.find({ parentDirId: directory._id }).lean();
      const files = await File.find({ parentDirId: directory._id }).lean();

      return res.status(200).json({
        ...directory,
        itemType: "directory",
        isFolder: true,
        directories: directories.map((d) => ({
          ...d,
          type: "directory",
          id: d._id,
        })),
        files: files.map((f) => ({
          ...f,
          type: "file",
          id: f._id,
        })),
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
          return {
            ...share,
            item: file,
            itemType: "file",
          };
        }

        const directory = await Directory.findById(share.fileId).lean();
        if (directory) {
          return {
            ...share,
            item: directory,
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
