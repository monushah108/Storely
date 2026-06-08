import express from "express";
import {
  createDirectory,
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";

const router = express.Router();

router.get("/:id?", getDirectory);

router.post("/:id?", createDirectory);

router.patch("/:id?", renameDirectory);
router.delete("/:id?", deleteDirectory);

export default router;
