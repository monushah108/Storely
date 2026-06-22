import express from "express";
import {
  login,
  logout,
  profile,
  register,
  getAllUsers,
  logoutUser,
  deleteUser,
  hardDeleteUser,
  RecoverUser,
  DeletedUser,
  SearchUser,
  FileExpoler,
  updateRoles,
  searchFileItem,
} from "../controllers/userController.js";
import checkAuth from "../middleware/authMilddleware.js";
import {
  DeleteFile,
  getFile,
  renameFile,
} from "../controllers/filesController.js";
import {
  deleteDirectory,
  getDirectory,
  renameDirectory,
} from "../controllers/directoryController.js";
import checkRole from "../rbac/RoleMiddleware.js";

const route = express.Router();

route.post("/user/register", register);

route.post("/user/login", login);

route.get("/user/profile", checkAuth, profile);
route.post("/user/logout", logout);

// users

route.get("/users", checkAuth, checkRole("user:read"), getAllUsers);

route.post(
  "/users/:userId/logout",
  checkAuth,
  checkRole("user:logout"),
  logoutUser,
);

route.delete(
  "/users/:userId",
  checkAuth,
  checkRole("user:soft_delete"),
  deleteUser,
);
route.delete(
  "/users/:userId/hard",
  checkAuth,
  checkRole("user:hard_delete"),
  hardDeleteUser,
);

route.post(
  "/users/:userId/recover",
  checkAuth,
  checkRole("user:recover"),
  RecoverUser,
);
route.get(
  "/users/deleted",
  checkAuth,

  DeletedUser,
);

route.get("/users/search", checkAuth, SearchUser);
route.get(
  "/users/:userId/:dirId?",
  checkAuth,
  checkRole("user:file:read"),
  FileExpoler,
);

route.get(
  "/users/:userId/file/:id",
  checkAuth,
  checkRole("user:file:read"),
  getFile,
);

route.patch(
  "/users/:userId/file/:id",
  checkAuth,
  checkRole("user:file:write"),
  renameFile,
);
route.delete(
  "/users/:userId/file/:id",
  checkAuth,
  checkRole("user:file:delete"),
  DeleteFile,
);

route.get(
  "/users/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:read"),
  getDirectory,
);
route.patch(
  "/users/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:write"),
  renameDirectory,
);
route.delete(
  "/users/:userId/directory/:id",
  checkAuth,
  checkRole("user:file:delete"),
  deleteDirectory,
);

route.patch(
  "/users/:userId/role",
  checkAuth,
  checkRole(["roles:assign_admin", "roles:assign_manager"]),
  updateRoles,
);

route.get(
  "/users/:userId/search",
  checkAuth,
  checkRole(["roles:assign_admin", "roles:assign_manager"]),
  searchFileItem,
);

export default route;
