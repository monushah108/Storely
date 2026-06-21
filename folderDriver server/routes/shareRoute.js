import express from "express";
import { getSharedfile, getToken } from "../controllers/shareController.js";
import checkAuth from "../middleware/authMilddleware.js";

const router = express.Router();

router.get("/:id", checkAuth, getToken);

router.post("/:id", getSharedfile);

export default router;
