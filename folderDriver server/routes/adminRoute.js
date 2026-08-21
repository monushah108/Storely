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
import checkRole from "../rbac/RoleMiddleware.js";

const route = express.Router();

// ========================================
// ADMIN AUTHENTICATION
// ========================================

route.use(checkAdminAccess);

// ========================================
// USERS
// ========================================

// Get all users
route.get("/", checkRole("user:read"), getAllUsers);

// Deleted users
route.get("/deleted", checkRole("user:read"), DeletedUser);

// Search users
route.get("/search", checkRole("user:read"), SearchUser);

// Logout a user
route.post("/:userId/logout", checkRole("user:logout"), logoutUser);

// Soft delete user
route.delete("/:userId", checkRole("user:soft_delete"), deleteUser);

// Hard delete user
route.delete("/:userId/hard", checkRole("user:hard_delete"), hardDeleteUser);

// Recover user
route.post("/:userId/recover", checkRole("user:recover"), RecoverUser);

// ========================================
// USER FILE EXPLORER
// ========================================

// Root directory
route.get("/:userId", checkRole("user:file:read"), FileExpoler);

// Specific directory
route.get("/:userId/:dirId", checkRole("user:file:read"), FileExpoler);

// ========================================
// USER FILES
// ========================================

route.get("/:userId/file/:id", checkRole("user:file:read"), getFile);

route.patch("/:userId/file/:id", checkRole("user:file:write"), renameFile);

route.delete("/:userId/file/:id", checkRole("user:file:delete"), DeleteFile);

// ========================================
// USER DIRECTORIES
// ========================================

route.get("/:userId/directory/:id", checkRole("user:file:read"), getDirectory);

route.patch(
  "/:userId/directory/:id",
  checkRole("user:file:write"),
  renameDirectory,
);

route.delete(
  "/:userId/directory/:id",
  checkRole("user:file:delete"),
  deleteDirectory,
);

// ========================================
// ROLE MANAGEMENT
// ========================================

route.patch(
  "/:userId/role",
  checkRole(["roles:assign_admin", "roles:assign_manager"]),
  updateRoles,
);

export default route;
