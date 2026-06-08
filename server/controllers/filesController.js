import { rename, rm } from "fs/promises";
import File from "../modles/fileModel.js";
import mime from "mime-types";
import path from "path";

export const getFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findById(id);
  try {
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = `${process.cwd()}/storage/${file.name}`;
    return res.sendFile(filePath, (err) => {
      if (!res.headersSent && err) {
        return res.status(404).json({ error: "File not found!" });
      }
    });
  } catch (err) {
    next(err);
  }
};

export const renameFile = async (req, res, next) => {
  const _id = req.params.id;
  const { newName: name } = req.body;
  const extension = path.extname(name);
  const file = await File.findOne({
    _id,
  }).select("extension name");

  try {
    if (!extension) {
      return res
        .status(400)
        .json({ message: "please defind extesnion of given file " });
    }

    if (!file) {
      return res.status(404).json({ message: "file not found" });
    }

    await rename(`./storage/${file.name}`, `./storage/${name}`);
    file.name = name;

    await file.save();
    return res.status(202).json({ message: "file name has been renamed" });
  } catch (err) {
    next(err);
  }
};

export const DeleteFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({
    _id: id,
  });
  if (!file) {
    return res.status(500).json({ message: "file is not exsist" });
  }
  try {
    await rm(`./storage/${file.name}`);
    await file.deleteOne();
    return res.json({ message: "File deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

export const uploadFile = async (req, res, next) => {
  const name = req.file.originalname;
  const extension = mime.extension(req.file.mimetype);
  const parentDirId = req.params.id || req.user.rootDirId.toString();
  const userId = req.user._id;

  try {
    // get file name from query

    const insertedFile = await File.create({
      name,
      extension,
      userId,
      parentDirId,
    });

    req.on("end", async () => {
      return res.status(201).json({ message: "File Uploaded" });
    });

    req.on("error", async () => {
      await File.deleteOne({ _id: insertedFile._id });
      return res.status(500).json({ error: "Error occurred while uploading" });
    });

    res.status(201).json({ message: "File Uploaded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};
