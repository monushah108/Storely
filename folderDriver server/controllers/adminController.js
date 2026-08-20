import AdminAccess from "../modles/adminAcessModel";

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

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

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