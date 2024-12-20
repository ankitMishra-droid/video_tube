import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";

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
      const removeLike = await Like.findByIdAndDelete(existedLike?._id);

      if(!removeLike){
        throw new ApiError(401, "error while remove like")
      }
    }

    const liked = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    if(!liked){
      throw new ApiError(500, "error while like toggle")
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "liked status changed", {}));
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
      const removeLike = await Like.findByIdAndDelete(existedLike?._id);

      if(!removeLike){
        throw new ApiError(500, "error while undo like")
      }
    }

    const liked = await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    if(!liked){
      throw new ApiError(500, "error while like on comment")
    }
    return res
      .status(200)
      .json(new ApiResponse(201, "liked", {}));
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
    const video = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "video",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline:[
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      userName: 1,
                      avatar: 1
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner"
                }
              }
            }
          ]
        },
      },
      {
        $addFields: {
          video: {
            $first: "$video"
          }
        }
      },
      {
        $match: {
          video: {
            $exists: true
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
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
