import express from "express";

import {
  createAdminAccess,
  updateAdminCredentials,
  registerAdmin,
  logoutAdmin,
  getAdminCredentials,
  clearAdminAccessToken,
  generateAccessToken,
  verifyAdminToken,
} from "../controllers/adminController.js";

import checkAuth from "../middleware/authMilddleware.js";
import checkRole from "../rbac/RoleMiddleware.js";

const route = express.Router();

// ========================================
// STATIC ROUTES: CREDENTIALS (OWNER ONLY)
// ========================================

route.get(
  "/credentials",
  checkAuth,
  checkRole("roles:assign_admin"),
  getAdminCredentials,
);

// Create admin credentials
route.post(
  "/credentials",
  checkAuth,
  checkRole("roles:assign_admin"),
  createAdminAccess,
);

// Update admin credentials (support both with and without :userId)
route.patch(
  "/credentials",
  checkAuth,
  checkRole("roles:assign_admin"),
  updateAdminCredentials,
);

route.patch(
  "/credentials/:userId",
  checkAuth,
  checkRole("roles:assign_admin"),
  updateAdminCredentials,
);

// ========================================
// STATIC ROUTES: ACCESS TOKEN (OWNER ONLY)
// ========================================

route.post(
  "/token",
  checkAuth,
  checkRole("roles:assign_admin"),
  generateAccessToken,
);

route.delete(
  "/token",
  checkAuth,
  checkRole("roles:assign_admin"),
  clearAdminAccessToken,
);

// ========================================
// STATIC ROUTES: ADMIN SESSION
// ========================================

// Logout admin session
route.post("/logout", logoutAdmin);

// ========================================
// PARAMETERIZED ROUTES: TOKEN REDEMPTION
// ========================================

// Verify token validity
route.get("/:token", checkAuth, verifyAdminToken);

// Redeem one-time admin access link
route.post("/:token/redeem", checkAuth, registerAdmin);

export default route;
