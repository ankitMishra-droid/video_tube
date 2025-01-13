import { Router } from "express";
import { verifyJWT, checkUser } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllUserTweets, getUserTweet, updateTweet } from "../controllers/tweet.controller.js";

const tweetRoutes = Router();

tweetRoutes.route("/").post(verifyJWT, createTweet)
tweetRoutes.route("/get-user-tweet/:userId").get(verifyJWT, getUserTweet)
tweetRoutes.route("/get-all-tweets").get(checkUser, getAllUserTweets)
tweetRoutes.route("/:tweetId").post(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet)

export {tweetRoutes }