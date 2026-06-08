import "./services/GithubAuthservice.js";
import express from "express";
import cors from "cors";
import directoryRoute from "./routes/directoryRoute.js";
import fileRoute from "./routes/fileRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/authMilddleware.js";

await connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser("my-secret-key-is-MONU"));
app.use(express.json());

app.use("/directory", checkAuth, directoryRoute);
app.use("/file", checkAuth, fileRoute);
app.use("/", userRoute);
app.use("/auth", authRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "something went wrong!" });
  // res.json(err);
});

app.listen(4000, () => {
  console.log("runing server");
});
