import Share from "../modles/shareModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import File from "../modles/fileModel.js";

export const getToken = async (req, res, next) => {
  const fileId = req.params.id;
  const userId = req.user._id;

  try {
    const token = crypto.randomBytes(8).toString("hex");
    const isTokeAlredyExist = await Share.findOne({ userId, fileId });

    if (isTokeAlredyExist) {
      return res.status(201).json(isTokeAlredyExist);
    }
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

    const file = await File.findById(share.fileId).populate(
      "userId",
      "picture name",
    );

    if (!file) {
      return res.status(410).json({
        message:
          "The resource you are looking for has been deleted by the owner",
      });
    }

    return res.status(200).json(file);
  } catch (err) {
    next(err);
  }
};
