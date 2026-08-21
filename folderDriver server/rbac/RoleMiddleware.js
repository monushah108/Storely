import { roles } from "./permission.js";

const checkRole = (actions) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const permissions = roles[userRole];

    if (!permissions) {
      return res.status(403).json({
        success: false,
        message: "Role not found",
      });
    }

    const requiredActions = Array.isArray(actions) ? actions : [actions];

    const hasPermission = requiredActions.some((action) =>
      permissions.includes(action),
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

export default checkRole;
