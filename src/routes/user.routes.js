import { Router } from "express";
import { createUser, loginUser, logout, updateProfile, changePassword, getCurrentUser, refreshAccessToken, getUserChannelProfile, getWatchHistory, sendResetLink, passwordReset } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.js";

const userRouter = Router();

userRouter.route("/register").post(upload.fields([{name: "avatar", maxCount: 1}, {name: "coverAvatar", maxCount: 1}]) ,createUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").get(verifyJWT, logout)
userRouter.route("/update-user").post(verifyJWT, updateProfile)
userRouter.route("/change-password").post(verifyJWT, changePassword)
userRouter.route("/get-current-user").get(verifyJWT, getCurrentUser)
userRouter.route("/refresh-access-token").get(verifyJWT, refreshAccessToken)
userRouter.route("/channel-name/:username").get(getUserChannelProfile)
userRouter.route("/watch-history").get(verifyJWT, getWatchHistory)
userRouter.route("/password-reset-link").post(sendResetLink);
userRouter.route("/:userId/:token").post(passwordReset)

export { userRouter }