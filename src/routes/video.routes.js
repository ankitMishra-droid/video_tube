import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { getAllVideos, getVideoById, publishVideo } from "../controllers/video.controller.js";

const videoRoutes = Router();

videoRoutes.route("/").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishVideo).get(getAllVideos)

videoRoutes.route("/:videoId").get(verifyJWT, getVideoById)

export { videoRoutes }