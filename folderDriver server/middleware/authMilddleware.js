import Session from "../modles/SessionModel.js";
import User from "../modles/userModel.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
    res.clearCookie("sid");
    return res.status(401).json({ message: "1 You are not logged in" });
  }

  const session = await Session.findById(sid);
  if (!session) {
    return res.status(401).json({ message: "2 Not logged in" });
  }

  const user = await User.findById({ _id: session.userId }).lean();
  if (!user) {
    return res.status(401).json({ error: "3 user is not found" });
  }

  req.user = user;

  next();
}
