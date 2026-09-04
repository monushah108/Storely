import mongoose, { Types } from "mongoose";
import User from "../modles/userModel.js";
import { verifyIdToken } from "../services/googleAuthservice.js";
import Directory from "../modles/directoryModel.js";
import Session from "../modles/SessionModel.js";
import Quota from "../modles/quotaModel.js";

export const loginWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  const userData = await verifyIdToken(idToken);
  const { email, name, picture } = userData;

  let user = await User.findOne({ email }).select("-__v");

  if (user) {
    if (user.deleted) {
      return res.status(403).json({
        error: "your account has been deleted. Contact app admin to recover ",
      });
    }

    const allSessions = await Session.find({ userId: user.id });
    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }

    if (!user.picture.includes("googleusercontent.com")) {
      user.picture = picture;
      await user.save();
    }

    const session = await Session.create({ userId: user._id });

    res.cookie("sid", session.id, {
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "logged in" });
  } else {
    const mongooseSession = await mongoose.startSession();

    try {
      const rootDirId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      mongooseSession.startTransaction();

      await Directory.insertOne(
        {
          _id: rootDirId,
          name: `root-${email}`,
          parentDirId: null,
          userId,
        },
        { mongooseSession },
      );

      await User.insertOne(
        {
          _id: userId,
          name,
          email,
          picture,
          rootDirId,
        },
        { mongooseSession },
      );

      await Quota.insertOne(
        {
          userId,
        },
        { mongooseSession },
      );

      const session = await Session.create({ userId });

      res.cookie("sid", session._id, {
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      mongooseSession.commitTransaction();

      return res.status(201).json({ message: "account created and logged in" });
    } catch (err) {
      mongooseSession.abortTransaction();

      next(err);
    }
  }
};

export const loginWithGithub = async (req, res, next) => {
  const { name, email, picture } = req.user;

  let user = await User.findOne({ email }).select("-__v");
  if (user) {
    if (user.deleted) {
      return res.status(403).json({
        error: "your account has been deleted. Contact app admin to recover ",
      });
    }

    if (!user.picture.includes("avatars.githubusercontent.com")) {
      user.picture = picture;
      await user.save();
    }

    const allSessions = await Session.find({ userId: user.id });
    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }
    const session = await Session.create({ userId: user._id });

    res.cookie("sid", session.id, {
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "logged in",
    });
  } else {
    const mongooseSession = await mongoose.startSession();

    try {
      const rootDirId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      mongooseSession.startTransaction();

      await Directory.insertOne(
        {
          _id: rootDirId,
          name: `root-${email}`,
          parentDirId: null,
          userId,
        },
        { mongooseSession },
      );

      await User.insertOne(
        {
          _id: userId,
          name,
          email,
          picture,
          rootDirId,
        },
        { mongooseSession },
      );

      await Quota.insertOne(
        {
          userId,
        },
        { mongooseSession },
      );

      const session = await Session.create({ userId });

      res.cookie("sid", session._id, {
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      mongooseSession.commitTransaction();
      return res.status(200).json({
        message: "logged in",
      });
    } catch (err) {
      mongooseSession.abortTransaction();

      next(err);
    }
  }
};
