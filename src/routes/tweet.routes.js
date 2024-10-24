import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const tweetRoutes = Router();

tweetRoutes.route("/").post(verifyJWT, createTweet)
tweetRoutes.route("/:userId").get(getUserTweets)
tweetRoutes.route("/:tweetId").post(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet)

export {tweetRoutes }