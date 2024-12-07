import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "https://video-tube-domi.vercel.app",
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { userRouter } from "./routes/user.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { likeRouter } from "./routes/like.routes.js";
import { commentRoute } from "./routes/comment.route.js";
import { tweetRoutes } from "./routes/tweet.routes.js";
import { subscriptionRoutes } from "./routes/subscription.routes.js";
import { playlistRoutes } from "./routes/playlist.router.js";
import { dashBoardRoutes } from "./routes/dashboard.routes.js";
import { healthCheckRouter } from "./routes/healthCheck.routes.js";

app.use("/api/users", userRouter);
app.use("/api/video", videoRoutes)
app.use("/api/like", likeRouter)
app.use("/api/comment", commentRoute)
app.use("/api/tweet", tweetRoutes)
app.use("/api/subscribe", subscriptionRoutes)
app.use("/api/playlist", playlistRoutes)
app.use("/api/dashboard", dashBoardRoutes)
app.use("/healthCheck", healthCheckRouter)

export { app };
