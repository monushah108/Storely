import express from "express";
import {
  DeleteFile,
  getFile,
  renameFile,
  uploadFile,
} from "../controllers/filesController.js";
import multer from "multer";
import path from "path";
import checkAuth from "../middleware/authMilddleware.js";
import checkRole from "../rbac/RoleMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(checkAuth);

router
  .route("/:id?")
  .get(checkRole("file:read"), getFile)
  .patch(checkRole("file:write"), renameFile)
  .delete(checkRole("file:delete"), DeleteFile)
  .post(checkRole("file:upload"), upload.single("file"), uploadFile);

export default router;
