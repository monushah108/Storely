import "dotenv/config";
import "./services/GithubAuthservice.js";
import express from "express";
import cors from "cors";
import directoryRoute from "./routes/directoryRoute.js";
import fileRoute from "./routes/fileRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import shareRoute from "./routes/shareRoute.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/authMilddleware.js";
import adminRoute from "./routes/adminRoute.js";
import adminAccessRoute from "./routes/adminAcessRoute.js";

import multer from "multer";
import helmet from "helmet";
import { consumeToken } from "./lib/rateLimiter.js";

await connectDB();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,

    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },

    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.json());

app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/directory", checkAuth, consumeToken, directoryRoute);
app.use("/file", checkAuth, consumeToken, fileRoute);
app.use("/share", consumeToken, shareRoute);
app.use("/admin/access", adminAccessRoute);
app.use("/admin", checkAuth, adminRoute);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file size should not exceed 10 MB",
      });
    }
  }
  console.error(err);
  res.status(err.status || 500).json({ error: "something went wrong!" });
  // res.json(err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
