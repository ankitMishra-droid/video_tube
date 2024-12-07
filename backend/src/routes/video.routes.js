import { Router } from "express";
import { verifyJWT, restrictUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { deleteVideos, getAllVideos, getUserVideo, getVideoById, publishVideo, togglePublish, updateVideo } from "../controllers/video.controller.js";

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

videoRoutes.route("/c/:userId").get(getUserVideo)

videoRoutes.route("/:videoId").get(verifyJWT, getVideoById).delete(verifyJWT, deleteVideos).patch(verifyJWT, upload.fields([{ name: "thumbnail", maxCount: 1 }]), updateVideo).put(verifyJWT, togglePublish)

export { videoRoutes }