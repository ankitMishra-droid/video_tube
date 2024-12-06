import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/likes.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/users.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  try {
    const { channelID } = req.params;

    if (!isValidObjectId(channelID)) {
      throw new Error("invalid channelId");
    }

    const user = await User.findById(channelID);

    if (!user) {
      throw new Error("user not found");
    }

    const subscriberCount = await Subscription.countDocuments({
      channel: channelID,
    });
    const subscribedChannelCount = await Subscription.countDocuments({
      subscriber: channelID,
    });

    const video = await Video.aggregate([
      {
        $match: {
          owner: channelID ? new mongoose.Types.ObjectId(channelID) : null,
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
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalVideos: 1,
          totalLikes: 1,
          totalViews: 1,
        },
      },
    ]);

    const channelStats = {
      subscriberCount: subscriberCount || 0,
      subscribedChannelCount: subscribedChannelCount || 0,
      totalVideos: video[0]?.totalVideos || 0,
      totalViews: video[0]?.totalViews || 0,
      totalLikes: video[0]?.totalLikes || 0,
    };

    return res
      .status(200)
      .json(new ApiResponse(201, "channel stats fetched", channelStats));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "something went wrong",
      error: true,
      success: false,
    });
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  try {
    const { channelID } = req.params;

    if (!isValidObjectId(channelID)) {
      throw new Error("invalid channel id");
    }

    const user = await User.findById(channelID);

    if (!user) {
      throw new Error("user not found");
    }

    const video = await Video.find({
      owner: channelID,
      isPublished: true,
    }).populate(
      "owner",
      {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        createdAt: 1,
        views: 1,
        userName: 1,
        firstName: 1,
        lastName: 1,
        avatar: 1,
      },
      "User"
    );

    if (!video || video.length === 0) {
      throw new Error("no videos uplaoded by the user");
    }

    return res.status(200).json(new ApiResponse(201, "video fetched", video));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "something went wrong",
      error: true,
      success: false,
    });
  }
});

export { getChannelStats, getChannelVideos };
