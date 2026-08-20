import express from "express";
import {
  getAllusers,
  logoutUser,
  deleteUser,
  hardDeleteUser,
  RecoverUser,
  DeletedUser,
  FileExpoler,
  updateRoles,
} from "../controllers/adminController";
import {
  DeleteFile,
  getFile,
  renameFile,
} from "../controllers/filesController";
import {
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController";
const route = express.Router();

route.get("/admin", checkAuth, checkRole("user:read"), getAllusers);

route.post(
  "/admin/:userId/logout",
  checkAuth,
  checkRole("user:logout"),
  logoutUser,
);

route.delete(
  "/admin/:userId",
  checkAuth,
  checkRole("user:soft_delete"),
  deleteUser,
);
route.delete(
  "/admin/:userId/hard",
  checkAuth,
  checkRole("user:hard_delete"),
  hardDeleteUser,
);

route.post(
  "/admin/:userId/recover",
  checkAuth,
  checkRole("user:recover"),
  RecoverUser,
);
route.get(
  "/admin/deleted",
  checkAuth,

  DeletedUser,
);

route.get("/admin/search", checkAuth, SearchUser);

route.get(
  "/admin/:userId/:dirId?",
  checkAuth,
  checkRole("user:file:read"),
  FileExpoler,
);

route.get(
  "/admin/:userId/file/:id",
  checkAuth,
  checkRole("user:file:read"),
  getFile,
);

route.patch(
  "/admin/:userId/file/:id",
  checkAuth,
  checkRole("user:file:write"),
  renameFile,
);
route.delete(
  "/admin/:userId/file/:id",
  checkAuth,
  checkRole("user:file:delete"),
  DeleteFile,
);

route.get(
  "/admin/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:read"),
  getDirectory,
);
route.patch(
  "/admin/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:write"),
  renameDirectory,
);
route.delete(
  "/admin/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:delete"),
  deleteDirectory,
);

route.patch(
  "/admin/:userId/role",
  checkAuth,
  checkRole(["roles:assign_admin", "roles:assign_manager"]),
  updateRoles,
);

export default route;
