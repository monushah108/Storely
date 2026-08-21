import AdminAccess from "../modles/adminAcessModel.js";
import User from "../modles/userModel.js";

const checkAdminAccess = async (req, res, next) => {
  try {
    // OWNER gets direct access
    if (req.user?.role === "owner") {
      return next();
    }

    // ADMIN needs admin access token
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

    const user = await User.findById(access.userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    req.user = user;
    req.adminAccess = access;

    next();
  } catch (error) {
    next(error);
  }
};

export default checkAdminAccess;
