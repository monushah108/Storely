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

import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

await connectDB();
const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.json());

app.use("/directory", checkAuth, directoryRoute);
app.use("/file", checkAuth, fileRoute);
app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/share", shareRoute);

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

app.listen(4000, () => {
  console.log("runing server");
});
