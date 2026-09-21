import mongoose from "mongoose";
import Session from "../modles/SessionModel.js";
import User from "../modles/userModel.js";

export default async function checkAuth(req, res, next) {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sid)) {
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      await Session.findByIdAndDelete(sid);
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.deleted) {
      await Session.deleteMany({ userId: user._id });
      res.clearCookie("sid", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact an administrator.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
