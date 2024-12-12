import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllChannelVideos, getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashBoardRoutes = Router();

dashBoardRoutes.route("/videos").get(verifyJWT, getAllChannelVideos)
dashBoardRoutes.route("/:channelID").get(verifyJWT, getChannelStats)
dashBoardRoutes.route("/videos/:channelID").get(verifyJWT, getChannelVideos)

export { dashBoardRoutes }