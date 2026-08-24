import AdminAccess from "../modles/adminAcessModel.js";

const checkAdminAccess = async (req, res, next) => {
  try {
    // OWNER gets direct access
    const user = req.user;

    if (user?.role === "owner") {
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

    const access = await AdminAccess.findOne({
      token,
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

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (!["owner", "admin"].includes(user.role)) {
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
