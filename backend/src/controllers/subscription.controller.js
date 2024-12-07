import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelID } = req.params;

  if (!channelID || !isValidObjectId(channelID)) {
    return res.status(400).json(new ApiError(400, "Invalid channel ID"));
  }

  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: req.user?._id,
      channel: channelID,
    });

    if (existingSubscription) {
      // Unsubscribe logic
      const unsubscribe = await Subscription.findByIdAndDelete(
        existingSubscription._id
      );

      if (!unsubscribe) {
        throw new ApiError(500, "Error while unsubscribing");
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, "Unsubscribed successfully")
        );
    } else {
      // Subscribe logic
      const subscribe = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelID,
      });

      if (!subscribe) {
        throw new ApiError(500, "Error while subscribing");
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, "Subscribed successfully")
        );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscribedId } = req.params;

  if (!subscribedId || !isValidObjectId(subscribedId)) {
    return res.status(400).json(new ApiError(400, "Invalid subscriber ID"));
  }

  try {
    const subscriptions = await Subscription.aggregate([
      {
        $match: { subscriber: new mongoose.Types.ObjectId(subscribedId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channelDetails",
        },
      },
      { $unwind: "$channelDetails" },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "channel",
          as: "subscribersChannel",
        },
      },
      {
        $addFields: {
          "channelDetails.isSubscribed": {
            $in: [
              req.user?._id,
              { $map: { input: "$subscribersChannel", as: "sc", in: "$$sc.subscriber" } },
            ],
          },
          "channelDetails.subscribersCount": {
            $size: "$subscribersChannel",
          },
        },
      },      
      {
        $group: {
          _id: null,
          channels: { $push: "$channelDetails" },
          totalChannels: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          channels: {
            _id: 1,
            isSubscribed: 1,
            subscribersCount: 1,
            userName: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
          },
          channelsCount: "$totalChannels",
        },
      },
    ]);

    if (!subscriptions) {
      throw new ApiError(404, "No subscribed channels found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Subscribed channels fetched", subscriptions));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelID } = req.params;

  if (!isValidObjectId(channelID)) {
    return res.status(400).json(new ApiError(400, "Invalid channel ID"));
  }

  try {
    const subscribers = await Subscription.aggregate([
      {
        $match: { channel: new mongoose.Types.ObjectId(channelID) },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribers",
        },
      },
      { $unwind: "$subscribers" },
      {
        $group: {
          _id: null,
          subscribers: { $push: "$subscribers" },
          totalSubscribers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          subscribers: {
            _id: 1,
            userName: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
          },
          subscribersCount: "$totalSubscribers",
        },
      },
    ]);

    if (!subscribers.length) {
      throw new ApiError(404, "No subscribers found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Subscribers fetched successfully")
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
});

export { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers };
