import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { userRouter } from "./routes/user.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { likeRouter } from "./routes/like.routes.js";

app.use("/api/users", userRouter);
app.use("/api/video", videoRoutes)
app.use("/api/like", likeRouter)

export { app };
