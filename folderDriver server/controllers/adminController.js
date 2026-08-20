import AdminAccess from "../modles/adminAcessModel";
import Directory from "../modles/directoryModel";
import File from "../modles/fileModel";
import Quota from "../modles/quotaModel";
import Session from "../modles/SessionModel";
import User from "../modles/userModel";
import sanitize from "sanitize-html";

export const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const selectedUser = role == "owner" ? ["user", "admin"] : ["user"];
  const allusers = await User.find({
    deleted: false,
    role: { $in: selectedUser },
  }).lean();
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const transformedUsers = allusers.map(
    ({ _id, name, email, role, picture }) => ({
      id: _id,
      name,
      picture,
      email,
      role,
      isLoggedIn: allSessionUserIdSet.has(_id.toString()),
    }),
  );
  return res.status(200).json(transformedUsers);
};

export const logoutUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await Session.deleteMany({ userId });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await Session.deleteMany({ userId });

    await User.findByIdAndUpdate(userId, { deleted: true });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const hardDeleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    await Session.deleteMany({ userId });
    await Directory.deleteMany({ userId });
    await Quota.deleteOne({ userId });

    const file = await File.find({ userId }).lean();

    await File.deleteMany({ userId });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const DeletedUser = async (req, res, next) => {
  const allusers = await User.find({
    deleted: true,
    role: { $in: ["user", "manager"] },
  }).lean();
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const transformedUsers = allusers.map(({ _id, name, email, role }) => ({
    id: _id,
    name,
    email,
    role,
    isLoggedIn: allSessionUserIdSet.has(_id.toString()),
  }));
  return res.status(200).json(transformedUsers);
};

export const RecoverUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { deleted: false },
      { new: true },
    );

    res.status(201).json({ message: "User has been recovered successfully" });
  } catch (err) {
    next(err);
  }
};

export const SearchUser = async (req, res, next) => {
  const { query: email } = req.query;

  const user = await User.find({
    deleted: false,
    role: { $in: ["user", "manager"] },
  })
    .select("-__v")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const allSession = await Session.find().lean();
  const allSessionUserId = allSession.map(({ userId }) => userId.toString());
  const allSessionUserIdSet = new Set(allSessionUserId);
  const searchedUser = user
    .filter(
      (user) => user.email.toLocaleLowerCase() == email.toLocaleLowerCase(),
    )
    .map(({ _id, name, email, role }) => ({
      id: _id,
      name,
      email,
      role,
      isLoggedIn: allSessionUserIdSet.has(_id.toString()),
    }));

  res.status(201).json(searchedUser);
};

export const FileExpoler = async (req, res, next) => {
  const { userId, dirId } = req.params;

  try {
    // decide which parent directory we need to query
    let parentDirId = dirId;

    if (!parentDirId) {
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      parentDirId = user.rootDirId;
    }

    const directories = await Directory.find({ parentDirId }).lean();
    const files = await File.find({ parentDirId }).lean();

    res.json({ file: files, directory: directories });
  } catch (err) {
    next(err);
  }
};

export const updateRoles = async (req, res) => {
  const { userId } = req.params;
  const extistingUser = req.user._id.toString();
  const { newRole } = req.body;
  if (extistingUser === userId) {
    return res
      .status(403)
      .json({ message: "you cannot change your role only owner can do!!" });
  }

  await User.findByIdAndUpdate(userId, { role: newRole });

  return res.status(201).json({ message: "role Changed successfully" });
};

export const checkAdminAccess = async (req, res, next) => {
  try {
    const token = req.cookies.admin_access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const tokenHash = AdminAccess.hashToken(token);

    const access = await AdminAccess.findOne({
      tokenHash,
      role: "admin",
      usedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Admin access expired or invalid",
      });
    }

    req.adminAccess = access;

    next();
  } catch (error) {
    next(error);
  }
};

export const createAdminAccess = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const token = AdminAccess.generateToken();
    const tokenHash = AdminAccess.hashToken(token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await AdminAccess.create({
      userId,
      role: "admin",
      tokenHash,
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      token,
      expiresAt,
    });
  } catch (error) {
    next(error);
  }
};
