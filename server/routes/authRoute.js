import express from "express";
import {
  loginWithGithub,
  loginWithGoogle,
} from "../controllers/authController.js";

import passport from "passport";

const router = express.Router();

router.post("/google", loginWithGoogle);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  loginWithGithub
);

export default router;
