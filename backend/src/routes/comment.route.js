import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comments.controller.js";

const commentRoute = Router()

commentRoute.route("/a/:videoId").post(verifyJWT, addComment)
commentRoute.route("/u/:commentId").post(verifyJWT, updateComment)
commentRoute.route("/d/:commentId").delete(verifyJWT, deleteComment)
commentRoute.route("/getcomments/:videoId").get(getAllComments)

export { commentRoute }