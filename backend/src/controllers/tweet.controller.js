import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose, { isValidObjectId, Types } from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      throw new Error("please write some tweet");
    }

    const userID = req.user?._id;
    const tweet = await Tweet.create({
      content: content,
      owner: userID,
    });

    if (!tweet) {
      throw new Error("tweet can't created try again");
    }

    return res.status(200).json(new ApiResponse(201, "tweet posted", tweet));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const getAllUserTweets = asyncHandler(async (req, res) => {
  const {page = 1, limit = 30} = req.query;
  try {
    const allTweet = await Tweet.aggregate([
      {
        $sort: {
          createdAt: -1
        }
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
          as: "userDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                userName: 1,
                avatar: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          userDetails: {
            $first: "$userDetails",
          },
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet",
          as: "likeDetails",
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: "$likeDetails",
          },
          isLiked: {
            $cond: {
              if: {
                $in: [req.user?._id, "$likeDetails.likedBy"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          userDetails: 1,
          likesCount: 1,
          createdAt: 1,
          isLiked: 1,
        },
      },
    ]);

    if(!allTweet){
      throw new ApiError(401, "error while fetching all tweets")
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "all tweet fetched", allTweet));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
      throw new Error("invalid id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      throw new Error("tweet not found");
    }

    if (tweet.owner.toString() != req.user?._id.toString()) {
      throw new Error("you cannot access to update this tweet");
    }

    const tweetUpdated = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(201, "tweet updated", tweetUpdated));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new Error("Invalid id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      throw new Error("Tweet not found");
    }

    if (tweet.owner.toString() != req.user?._id.toString()) {
      throw new Error("you don't have access to delete this tweet");
    }

    const tweetDelete = await Tweet.findByIdAndDelete(tweetId);

    return res
      .status(200)
      .json(new ApiResponse(201, "tweet deleted", tweetDelete));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const getUserTweet = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 30 } = req.query;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "user id not found");
  }

  try {
    const userTweet = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
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
                _id: 1,
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
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet",
          as: "likeDetails",
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: "$likeDetails",
          },
          isLiked: {
            $cond: {
              if: {
                $in: [req.user?._id, "$likeDetails.likedBy"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          owner: 1,
          likesCount: 1,
          isLiked: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!userTweet) {
      throw new ApiError(401, "Error while fetching user tweet");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "user tweets fetched", userTweet));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "something went wrong",
      error: true,
      success: false,
    });
  }
});

export {
  createTweet,
  getAllUserTweets,
  updateTweet,
  deleteTweet,
  getUserTweet,
};
