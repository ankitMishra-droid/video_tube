import { Router } from "express";
import { verifyJWT, checkUser } from "../middlewares/auth.middleware.js";
import { getAllChannelVideos, getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashBoardRoutes = Router();

dashBoardRoutes.route("/videos").get(verifyJWT, getAllChannelVideos)
dashBoardRoutes.route("/:channelID").get(checkUser, getChannelStats)
dashBoardRoutes.route("/videos").get(verifyJWT, getChannelVideos)

export { dashBoardRoutes }