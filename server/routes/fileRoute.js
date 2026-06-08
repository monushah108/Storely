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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path.basename(file.originalname, ext);

    cb(null, `${name}${ext}`);
  },
});

const upload = multer({ storage });

router.use(checkAuth);

router
  .route("/:id?")
  .get(checkRole("file:read"), getFile)
  .patch(checkRole("file:write"), renameFile)
  .delete(checkRole("file:delete"), DeleteFile)
  .post(checkRole("file:upload"), upload.single("file"), uploadFile);

export default router;
