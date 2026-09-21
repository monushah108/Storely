import express from "express";

import {
  logoutUser,
  deleteUser,
  hardDeleteUser,
  RecoverUser,
  DeletedUser,
  FileExpoler,
  updateRoles,
  getAllUsers,
  SearchUser,
  getAdminProfile,
} from "../controllers/adminController.js";

import {
  DeleteFile,
  getFile,
  renameFile,
} from "../controllers/filesController.js";

import {
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";

import checkAdminAccess from "../middleware/adminAcessMiddleware.js";
import { requirePermission, checkRole } from "../rbac/RoleMiddleware.js";

const route = express.Router();

// ========================================
// ADMIN AUTHENTICATION
// ========================================

route.use(checkAdminAccess);

// ========================================
// ADMIN PROFILE
// ========================================

route.get("/profile", requirePermission("admin:profile:read"), getAdminProfile);

// ========================================
// USERS
// ========================================

// Get all users
route.get("/", checkRole("user:read"), getAllUsers);

// Deleted users (must precede /:userId)
route.get("/deleted", checkRole("user:read"), DeletedUser);

// Search users (must precede /:userId)
route.get("/search", checkRole("user:read"), SearchUser);

// ========================================
// USER ACTIONS & LIFECYCLE
// ========================================

// Logout a user
route.post("/:userId/logout", checkRole("user:logout"), logoutUser);

// Hard delete user (must precede generic /:userId delete)
route.delete("/:userId/hard", checkRole("user:hard_delete"), hardDeleteUser);

// Soft delete user
route.delete("/:userId", checkRole("user:soft_delete"), deleteUser);

// Recover user
route.post("/:userId/recover", checkRole("user:recover"), RecoverUser);

// ========================================
// ROLE MANAGEMENT
// ========================================

route.patch(
  "/:userId/role",
  checkRole(["roles:assign_admin", "roles:assign_user"]),
  updateRoles,
);

// ========================================
// USER FILES & DIRECTORIES
// ========================================

route.get("/:userId/file/:id", checkRole("user:file:read"), getFile);
route.patch("/:userId/file/:id", checkRole("user:file:write"), renameFile);
route.delete("/:userId/file/:id", checkRole("user:file:delete"), DeleteFile);

route.get("/:userId/directory/:id", checkRole("user:file:read"), getDirectory);
route.patch("/:userId/directory/:id", checkRole("user:file:write"), renameDirectory);
route.delete("/:userId/directory/:id", checkRole("user:file:delete"), deleteDirectory);

// ========================================
// USER FILE EXPLORER (Catch-all parameterized routes)
// ========================================

// Specific directory
route.get("/:userId/:dirId", checkRole("user:file:read"), FileExpoler);

// Root directory
route.get("/:userId", checkRole("user:file:read"), FileExpoler);

export default route;
