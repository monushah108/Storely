import express from "express";
import {
  createDirectory,
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";
import checkRole from "../rbac/RoleMiddleware.js";

const router = express.Router();

router.get("/:id?", checkRole("file:read"), getDirectory);
router.post("/:id?", checkRole("file:write"), createDirectory);
router.patch("/:id?", checkRole("file:write"), renameDirectory);
router.delete("/:id?", checkRole("file:delete"), deleteDirectory);

export default router;
