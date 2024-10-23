import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllLikedOnVideo, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/v/:videoId")
    .post(verifyJWT, toggleVideoLike)
    .post(verifyJWT, toggleCommentLike)
    .post(verifyJWT, toggleTweetLike);

likeRouter.route("/videos").get(getAllLikedOnVideo)

export { likeRouter }