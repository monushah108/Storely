import express from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/userController.js";
import checkAuth from "../middleware/authMilddleware.js";

const route = express.Router();

route.post("/user/register", register);

route.post("/user/login", login);

route.get("/user/profile", checkAuth, profile);
route.post("/user/logout", logout);

export default route;
