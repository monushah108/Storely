import express from "express";

import {
  createAdminAccess,
  updateAdminCredentials,
  registerAdmin,
  logoutAdmin,
  getAdminCredentials,
  generateAdminAccessToken,
  clearAdminAccessToken,
} from "../controllers/adminController.js";

import checkAuth from "../middleware/authMilddleware.js";
import checkRole from "../rbac/RoleMiddleware.js";

const route = express.Router();

// ========================================
// OWNER
// ========================================

route.get(
  "/credentials",
  checkAuth,
  checkRole("roles:assign_admin"),
  getAdminCredentials,
);

// Create admin access for a user
route.post(
  "/credentials",
  checkAuth,
  checkRole("roles:assign_admin"),
  createAdminAccess,
);

// Update admin credential
route.patch(
  "/credentials/:userId",
  checkAuth,
  checkRole("roles:assign_admin"),
  updateAdminCredentials,
);

// genrate access token

route.post("/token", checkAuth, generateAdminAccessToken);

route.delete("/token", checkAuth, clearAdminAccessToken);

// ========================================
// PUBLIC
// ========================================

// Redeem one-time admin access link
route.post("/:token/redeem", registerAdmin);

// ========================================
// ADMIN
// ========================================

// Logout admin session
route.post("/logout", logoutAdmin);

export default route;
