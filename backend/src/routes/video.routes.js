import { Router } from "express";
import { verifyJWT, checkUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import {
  deleteVideos,
  getAllVideos,
  getUserSubscribedVideos,
  getUserVideo,
  getVideoById,
  publishVideo,
  togglePublish,
  updateVideo,
} from "../controllers/video.controller.js";

const videoRoutes = Router();

videoRoutes
  .route("/")
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishVideo
  )
  .get(getAllVideos);

videoRoutes.route("/c/:userId").get(verifyJWT, getUserVideo);

videoRoutes
  .route("/:videoId")
  .get(checkUser, getVideoById)
  .delete(verifyJWT, deleteVideos)
  .patch(verifyJWT, updateVideo)
  .put(verifyJWT, togglePublish);

videoRoutes.route("/s/subscription").get(checkUser, getUserSubscribedVideos)

export { videoRoutes };
