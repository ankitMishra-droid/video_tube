import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PROD
];

console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors())

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
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
app.use("/api/healthCheck", healthCheckRouter)

export { app };
