import { rm } from "fs/promises";
import Directory from "../modles/directoryModel.js";
import File from "../modles/fileModel.js";

export const getDirectory = async (req, res) => {
  const user = req.user;
  const _id = req.params.id || user.rootDirId.toString();
  const directory = await Directory.findOne({ _id }).lean();
  try {
    if (!directory) {
      return res.status(401).json({ message: "no Directory found" });
    }

    const directories = await Directory.find({ parentDirId: _id }).lean();
    const files = await File.find({ parentDirId: _id }).lean();

    return res.status(200).json({
      ...directory,
      directories: directories.map((dirId) => ({ ...dirId, id: dirId._id })),
      files: files.map((dirId) => ({ ...dirId, id: dirId._id })),
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const renameDirectory = async (req, res, next) => {
  const _id = req.params.id;
  const name = req.body.newName;
  try {
    const directory = await Directory.findOneAndUpdate(
      { _id },
      {
        name,
      },
      { new: true }
    );
    if (!directory) {
      res.status(404).json({ message: "Directory not found" });
    }

    res.status(200).json({ message: "Directory has been renamed" });
  } catch (err) {
    next(err);
  }
};

export const createDirectory = async (req, res, next) => {
  const name = req.body.folderName;
  const userId = req.user._id;
  const parentDirId = req.params.id || req.user.rootDirId;

  try {
    const directory = await Directory.insertOne({
      name,
      userId,
      parentDirId,
    });

    await directory.save();

    res.status(200).json({ message: "Directory has been created" });
  } catch (err) {
    next(err);
  }
};

export const deleteDirectory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const directoryData = await Directory.findOne({
      _id: id,
    })
      .select("_id")
      .lean();

    if (!directoryData) {
      return res.status(404).json({ error: "Directory not found!" });
    }

    async function getDirectoryContents(id) {
      let files = await File.find({ parentDirId: id })
        .select("extension name")
        .lean();

      let directories = await Directory.find({ parentDirId: id })
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

    for (const { name, extension } of files) {
      await rm(`./storage/${name}`);
    }

    await File.deleteMany({
      _id: { $in: files.map(({ _id }) => _id) },
    });

    await Directory.deleteMany({
      _id: { $in: [...directories.map(({ _id }) => _id), id] },
    });
  } catch (err) {
    next(err);
  }
  return res.json({ message: "Files deleted successfully" });
};
