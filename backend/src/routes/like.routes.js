import { Router } from "express";
import { verifyJWT, checkUser } from "../middlewares/auth.middleware.js";
import { getAllLikedOnVideo, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/v/:videoId").post(verifyJWT, toggleVideoLike)
likeRouter.route("/toggle/c/:commentId").post(verifyJWT, toggleCommentLike)
likeRouter.route("/toggle/t/:tweetId").post(verifyJWT, toggleTweetLike);
likeRouter.route("/videos").get(checkUser,getAllLikedOnVideo)

export { likeRouter }