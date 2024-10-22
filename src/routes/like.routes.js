import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllLikedOnVideo, toggleVideoLike } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/toggle/v/:videoId")
    .post(verifyJWT, toggleVideoLike)

likeRouter.route("/videos").get(getAllLikedOnVideo)

export { likeRouter }