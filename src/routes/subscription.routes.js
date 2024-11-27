import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRoutes = Router();

subscriptionRoutes.route("/c/:channelID").post(verifyJWT, toggleSubscription)
subscriptionRoutes.route("/d/:channelID").get(verifyJWT, getUserChannelSubscribers)
subscriptionRoutes.route("/a/:subscribedId").get(getSubscribedChannels)

export { subscriptionRoutes }