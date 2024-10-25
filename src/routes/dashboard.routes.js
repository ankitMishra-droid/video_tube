import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashBoardRoutes = Router();

dashBoardRoutes.route("/:channelID").get(verifyJWT, getChannelStats)
dashBoardRoutes.route("/videos/:channelID").get(verifyJWT, getChannelVideos)

export { dashBoardRoutes }