import express from "express";

import {
  createAdminAccess,
  updateAdminCredentials,
  registerAdmin,
  logoutAdmin,
} from "../controllers/adminAccessController.js";

import checkAuth from "../middleware/authMilddleware.js";
import requireOwner from "../middleware/requireOwner.js";

const route = express.Router();

// ========================================
// OWNER
// ========================================

// Create admin access for a user
route.post("/:userId", checkAuth, requireOwner, createAdminAccess);

// Update admin credential
route.patch(
  "/credentials/:userId",
  checkAuth,
  requireOwner,
  updateAdminCredentials,
);

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
