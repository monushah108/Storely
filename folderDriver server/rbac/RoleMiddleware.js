import { roles, hasAllPermissions, hasAnyPermission, ROLES } from "./permission.js";

/**
 * Middleware to enforce role-based access.
 * Usage:
 *   requireRole("owner")
 *   requireRole(["owner", "admin"])
 */
export const requireRole = (allowedRoles) => {
  const rolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (user.deleted) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Please contact an administrator.",
      });
    }

    const userRole = user.role;

    if (!userRole || !rolesList.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient role privileges.",
      });
    }

    next();
  };
};

/**
 * Middleware to enforce permission-based access.
 * Usage:
 *   requirePermission("file:read")
 *   requirePermission(["user:read", "user:soft_delete"], { mode: "all" })
 *   requirePermission(["roles:assign_admin", "roles:assign_user"], { mode: "any" })
 */
export const requirePermission = (requiredActions, options = {}) => {
  const { mode = "all" } = options;
  const actionsList = Array.isArray(requiredActions)
    ? requiredActions
    : [requiredActions];

  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (user.deleted) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Please contact an administrator.",
      });
    }

    const userRole = user.role;

    if (!userRole || !roles[userRole]) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Role not recognized.",
      });
    }

    const isAuthorized =
      mode === "any"
        ? hasAnyPermission(userRole, actionsList)
        : hasAllPermissions(userRole, actionsList);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have the required permissions.",
        required: actionsList,
      });
    }

    next();
  };
};

/**
 * Backwards-compatible checkRole middleware wrapper.
 * By default: if multiple actions are supplied, passes if user has ANY of them (preserving previous behavior),
 * or checks all if mode is "all".
 */
export const checkRole = (actions, options = { mode: "any" }) => {
  return requirePermission(actions, options);
};

export default checkRole;
