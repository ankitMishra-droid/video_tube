import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelID } = req.params;

  if (!channelID || !isValidObjectId(channelID)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelID,
  });

  if (existingSubscription) {
    // Unsubscribe logic
    const unsubscribe = await Subscription.findByIdAndDelete(
      existingSubscription
    );

    if (!unsubscribe) {
      throw new ApiError(500, "Error while unsubscribing");
    }
  } else {
    // Subscribe logic
    const subscribe = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelID,
    });

    if (!subscribe) {
      throw new ApiError(500, "Error while subscribing");
    }
  }

  return res.status(200).json(new ApiResponse(200, "Subscription toggled", {}));
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
            $cond: {
              if: {
                $in: [
                  new mongoose.Types.ObjectId(req.user?._id),
                  "$subscribersChannel.subscriber",
                ],
              },
              then: true,
              else: false, // Corrected from "true" to "false"
            },
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

    if (!subscriptions.length) {
      throw new ApiError(404, "No subscribed channels found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Subscribed channels fetched", subscriptions[0]));
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
        new ApiResponse(200, "Subscribers fetched successfully", subscribers)
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
