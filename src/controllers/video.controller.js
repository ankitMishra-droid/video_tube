import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.model.js";
import { Video } from "../models/video.model.js";
import crypto from "crypto";

const publishVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;

        const videoFile = req.files?.videoFile?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile) {
            throw new ApiError(401, "Video file is required");
        }

        if (!thumbnailFile) {
            throw new ApiError(401, "Thumbnail is required");
        }

        const videoSrc = `/users_video/${req.user._id}/${videoFile.filename}`;
        const thumbnailSrc = `/users_video/${req.user._id}/${thumbnailFile.filename}`;

        const video = await Video.create({
            title,
            description,
            videoFile: {
                url: videoSrc,
                public_id: crypto.randomBytes(32).toString("hex")
            },
            thumbnail: {
                url: thumbnailSrc,
                public_id: crypto.randomBytes(32).toString("hex")
            },
            duration: req.body.duration || "Unknown",
            isPublished: false,
            owner: req.user?._id
        });

        const uploadedVideo = await Video.findById(video._id);

        if (!uploadedVideo) {
            throw new ApiError(401, "Video uploading failed.");
        }

        return res.status(201).json(
            new ApiResponse(201, "Video uploaded", uploadedVideo)
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiError(500, "Something went wrong")
        );
    }
});

export { publishVideo };
