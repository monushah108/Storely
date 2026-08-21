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
