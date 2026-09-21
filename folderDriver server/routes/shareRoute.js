import express from "express";
import {
  getSharedfile,
  getToken,
  getUserShares,
  deleteShare,
} from "../controllers/shareController.js";
import checkAuth from "../middleware/authMilddleware.js";

const router = express.Router();

router.get("/user/all", checkAuth, getUserShares);
router.get("/:id", checkAuth, getToken);
router.post("/:id", getSharedfile);
router.delete("/:id", checkAuth, deleteShare);

export default router;
