export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  USER: "user",
  VIEWER: "viewer",
};

// Base permissions for all standard authenticated users
const USER_PERMISSIONS = [
  "file:read",
  "file:write",
  "file:delete",
  "file:upload",
  "directory:read",
  "directory:create",
  "directory:write",
  "directory:delete",
  "share:read",
  "share:create",
  "share:delete",
];

// Admin permissions (includes all user permissions + administration of regular users)
const ADMIN_PERMISSIONS = [
  ...USER_PERMISSIONS,
  "user:read",
  "user:soft_delete",
  "user:recover",
  "user:logout",
  "user:file:read",
  "user:file:write",
  "user:file:delete",
  "roles:assign_user",
  "admin:access",
  "admin:profile:read",
];

// Owner permissions (highest privilege: inherits admin + hard delete + privilege delegation)
const OWNER_PERMISSIONS = [
  ...ADMIN_PERMISSIONS,
  "user:hard_delete",
  "roles:assign_admin",
  "admin:credentials:manage",
  "admin:access:grant",
  "admin:access:revoke",
];

const VIEWER_PERMISSIONS = [
  "file:read",
  "directory:read",
];

export const roles = {
  [ROLES.OWNER]: OWNER_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.USER]: USER_PERMISSIONS,
  [ROLES.VIEWER]: VIEWER_PERMISSIONS,
};

/**
 * Returns all permissions granted to a given role.
 */
export const getRolePermissions = (role) => {
  return roles[role] || [];
};

/**
 * Checks if a given role has a specific permission.
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const permissions = roles[role];
  if (!permissions) return false;
  return permissions.includes(permission);
};

/**
 * Checks if a given role has ALL of the specified permissions.
 */
export const hasAllPermissions = (role, requiredPermissions = []) => {
  if (!role) return false;
  const permissions = roles[role];
  if (!permissions) return false;
  const list = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];
  return list.every((p) => permissions.includes(p));
};

/**
 * Checks if a given role has ANY of the specified permissions.
 */
export const hasAnyPermission = (role, requiredPermissions = []) => {
  if (!role) return false;
  const permissions = roles[role];
  if (!permissions) return false;
  const list = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];
  return list.some((p) => permissions.includes(p));
};

/**
 * Validates whether a caller role is authorized to assign a target role (prevents privilege escalation).
 */
export const canAssignRole = (callerRole, targetRole) => {
  if (callerRole === ROLES.OWNER) {
    return [ROLES.USER, ROLES.ADMIN].includes(targetRole);
  }
  if (callerRole === ROLES.ADMIN) {
    // Admins can only assign the standard user role (cannot promote to admin or owner)
    return targetRole === ROLES.USER;
  }
  return false;
};
