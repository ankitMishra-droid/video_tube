import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new Error("invalid id");
    }

    const existedLike = await Like.findOne({
      video: videoId,
      likedBy: req.user?._id,
    });

    if (existedLike) {
      await Like.findByIdAndDelete(existedLike?._id);

      return res
        .status(200)
        .json(new ApiResponse(201, "dislike", { isLiked: false }));
    }

    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(201, "liked", { isLiked: true }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new Error("comment id invalid");
    }

    const existedLike = await Like.findOne({
      comment: commentId,
      likedBy: req.user?._id,
    });

    if (existedLike) {
      await Like.findByIdAndDelete(existedLike?._id);

      return res
        .status(200)
        .json(new ApiResponse(201, "disliked", { isLiked: false }));
    }

    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(201, "liked", { isLiked: true }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new Error("invalid id");
    }

    const existedLike = await Like.findOne({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    if (existedLike) {
      await Like.findByIdAndDelete(existedLike?._id);

      return res
        .status(200)
        .josn(new ApiResponse(201, "disliked", { isLiked: false }));
    }

    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(201, "liked", { isLiked: true }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const getAllLikedOnVideo = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = new mongoose.Types.ObjectId(userId);

    const video = await Like.aggregate([
      {
        $match: {
          likedBy: user,
          video: {
            $exists: true,
          },
        },
      },
      {
        $lookup: {
          from: "video",
          localField: "video",
          foreignField: "_id",
          as: "videos",
        },
      },
    ]);

    if (video.length < 1) {
      return res.status(200).json(new ApiResponse(201, "no liked count yet"));
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "liked on videos fetched", video));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});
export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getAllLikedOnVideo,
};
