import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { Comments } from "../models/comment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/users.model.js";
import { Subscription } from "../models/subscription.model.js";
import fs from "fs";
import { View } from "../models/viewController.model.js";

function unlinkPath(videoFilePath, thumbnailFilePath) {
  if (videoFilePath) fs.unlinkSync(videoFilePath);
  if (thumbnailFilePath) fs.unlinkSync(thumbnailFilePath);
}

const publishVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    // Ensure that files are uploaded
    if (!req.files || !req.files.videoFile) {
      throw new ApiError(401, "Video file is required");
    }

    if (!req.files.thumbnail || req.files.thumbnail.length === 0) {
      throw new ApiError(401, "Thumbnail is required");
    }

    const videoFilePath = req.files.videoFile[0].path;
    const thumbnailFilePath = req.files.thumbnail[0].path;

    const videoFile = await uploadOnCloudinary(
      videoFilePath,
      "videos from users"
    );
    const thumbnailFile = await uploadOnCloudinary(
      thumbnailFilePath,
      "thumbnail"
    );

    if (!videoFile || !thumbnailFile) {
      unlinkPath(videoFilePath, thumbnailFilePath)
      throw new ApiError(500, "File upload failed");
    }

    const video = await Video.create({
      title,
      description,
      videoFile: videoFile.secure_url,
      thumbnail: thumbnailFile.secure_url,
      duration: videoFile.duration,
      isPublished: req.body.isPublished || false,
      owner: req.user?._id,
    });

    // Ensure video was created
    const uploadedVideo = await Video.findById(video._id);
    if (!uploadedVideo) {
      throw new ApiError(401, "Video uploading failed.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Video uploaded", uploadedVideo));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;

    const validSortByFields = ["createdAt", "duration", "views"];
    if (!validSortByFields.includes(sortBy)) {
      throw new ApiError(
        400,
        "Invalid 'sortBy' field. Valid options are: createdAt, duration, views."
      );
    }

    const validSortTypes = ["asc", "desc"];
    if (!validSortTypes.includes(sortType)) {
      throw new ApiError(
        400,
        "Invalid 'sortType'. Valid options are: asc, desc."
      );
    }

    const matchConditions = {
      isPublished: true,
    };

    if (query) {
      matchConditions.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const videos = await Video.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                avatar: 1,
                userName: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" }, // Get the first matched owner
        },
      },
      {
        $project: {
          _id: 1,
          owner: 1,
          thumbnail: 1,
          videoFile: 1,
          createdAt: 1,
          description: 1,
          title: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
        },
      },
      {
        $sort: {
          [sortBy]: sortType === "desc" ? -1 : 1,
        },
      },
      {
        $skip: (page - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    if (videos.length === 0) {
      throw new ApiError(404, "Videos not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Videos fetched successfully.", videos));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Something went wrong"
        )
      );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "invalid videoID");
    }

    const fetchVideo = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: {
            $size: "$likes",
          },
          isLiked: {
            $cond: {
              if: {
                $in: [req.user?._id, "$likes.likedBy"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
              },
            },
            {
              $addFields: {
                subscriberCount: {
                  $size: "$subscribers",
                },
                isSubscribed: {
                  $cond: {
                    if: {
                      $in: [req.user?._id, "$subscribers.subscriber"],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $project: {
                userName: 1,
                avatar: 1,
                subscriberCount: 1,
                isSubscribed: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $project: {
          videoFile: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          views: 1,
          subscriberCount: 1,
          likeCount: 1,
          isLiked: 1,
          duration: 1,
          commetns: 1,
          owner: 1,
        },
      },
    ]);

    if (!fetchVideo) {
      throw new ApiError(404, "video dosen't availabe");
    }

    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });

    await User.findByIdAndUpdate(req.user?._id, {
      $addToSet: {
        watchHistory: videoId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(201, "video fetched", fetchVideo));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, "something went wrong"));
  }
});

const getVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId, duration, durationWatched } = req.body

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video or user id")
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "video not found")
    }

    const MIN_DUR = 30;
    const REWATCH_DUR = 0.6;

    const exisitngView = await View.findOne({
      video: videoId,
      user: userId
    });

    if (!exisitngView) {
      if (durationWatched >= MIN_DUR) {
        await Video.findByIdAndUpdate(videoId, {
          $inc: { views: 1 }
        })

        await View.create({
          video: videoId,
          user: userId,
          lastWatch: new Date(),
          watchedDuration: durationWatched
        });

        return res.status(200).json(
          new ApiResponse(200, "View Counted")
        )
      }
      return res.status(200).json(new ApiResponse(200, "Atleast 30 sec to watch to count views"))
    }

    let watchedPercentage = (durationWatched / duration) * 100;

    if (watchedPercentage >= REWATCH_DUR * 100) {
      const timeSinceLastView = Date.now() - new Date(exisitngView.lastWatchedAt).getTime();
      const hoursInMs = 3600000;

      if (timeSinceLastView > hoursInMs) {
        await Video.findByIdAndUpdate(videoId, {
          $inc: { views: 1 }
        })


        exisitngView.lastWatchedAt = new Date();
        exisitngView.watchedDuration = durationWatched;
        await exisitngView.save()

        return res.status(200).json(new ApiResponse(200, "view count updated"))
      } else {
        return res.status(200).json(new ApiResponse(200, "wait for again view count"))
      }
    }

    return res.status(200).json(new ApiResponse(200, "atleast 30 sec to wait for views count"))
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
      error: true,
      success: false
    })
  }
})

const deleteVideos = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new Error("video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
      throw new Error("you cannot access to delete this video");
    }

    const videoDeleted = await Video.findByIdAndDelete(videoId);

    if (!videoDeleted) {
      throw new Error("somthing went wrong");
    }

    await Like.deleteMany({ video: videoId });
    await Comments.deleteMany({ video: videoId });

    return res
      .status(200)
      .json(new ApiResponse(201, "video deleted", videoDeleted));
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
      error: true,
      success: false,
    });
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new Error("invalid video id");
    }

    const { title, description } = req.body;

    if (!(title && description)) {
      throw new Error("all fields are required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new Error("video not found");
    }

    if (video.owner.toString() != req.user?._id.toString()) {
      throw new Error("only owner is to be accessed to update video");
    }

    // await video.thumbnail.public_id;

    // const thumbnailPath = req.files?.thumbnail[0]?.path;

    // if (!thumbnailPath) {
    //   throw new Error("Thumbnail is required");
    // }

    const updatedVideo = await Video.findByIdAndUpdate(
      video,
      {
        $set: {
          title: title,
          description: description,
        },
      },
      { new: true }
    );

    if (!updatedVideo) {
      throw new Error("failed to update video");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "video updated", updateVideo));
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
      error: true,
      success: false,
    });
  }
});

const togglePublish = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new Error("invalid videoID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new Error("video not found");
    }

    if (video.owner.toString() != req.user?._id.toString()) {
      throw new Error("only owner can publish this video");
    }

    const toggleVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        isPublished: !video.isPublished,
      },
      { new: true }
    );

    if (!toggleVideo) {
      throw new Error("published failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(202, "video published", toggleVideo));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const getUserVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortType = "desc" } = req.query;
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "invalid user id");
  }

  const video = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              avatar: 1,
              userName: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        ],
      },
    },
    {
      $sort: {
        createdAt: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(401, "Error while fetching video");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, "fetched user videos", video));
});

const getUserSubscribedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortType = "desc" } = req.query;

  const subscriber = await Subscription.find({
    subscriber: new mongoose.Types.ObjectId(req.user?._id),
  }).select("channel");

  const channels = subscriber.map((sub) => sub.channel);

  if (channels.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No subscribed channels found", []));
  }

  const video = await Video.aggregate([
    {
      $match: {
        owner: {
          $in: channels.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $match: { isPublished: true },
    },
    {
      $sort: {
        createdAt: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: parseInt(limit)
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              firstName: 1,
              lastName: 1,
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
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1
      }
    }
  ]);

  if (!video) {
    throw new ApiError(401, "subscribed video fetching failed");
  }

  return res.status(200).json(
    new ApiResponse(201, "subscribed videos fetched", video)
  )
});

export {
  publishVideo,
  getAllVideos,
  getVideoById,
  getVideoViews,
  deleteVideos,
  updateVideo,
  togglePublish,
  getUserVideo,
  getUserSubscribedVideos,
};
