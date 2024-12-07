import { ApiResponse } from "../utils/ApiResponse.js";
import { Comments } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import mongoose, { isValidObjectId } from "mongoose";

const addComment = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!videoId) {
      throw new Error("invalid video id");
    }

    if (!content) {
      throw new Error("please add comment");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new Error("video not found");
    }

    const comment = await Comments.create({
      content: content,
      video: videoId,
      owner: req.user?._id,
    });

    if (!comment) {
      throw new Error("somthing went wrong");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "comment addded", comment));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "something went wrong",
      error: true,
      success: false,
    });
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
      throw new Error("invalid id");
    }

    if (!content) {
      throw new Error("write a commment");
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      throw new Error("comment not found");
    }

    const updatedComment = await Comments.findByIdAndUpdate(
      comment?._id,
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(201, "comment updates", updatedComment));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      throw new Error("video id not found");
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      throw new Error("comment not found");
    }

    if (comment.owner.toString() != req.user?._id.toString()) {
      throw new Error("only created user can delete");
    }

    const deletedComment = await Comments.findByIdAndDelete(comment?._id, {
      comment: commentId,
      likedBy: req.user,
    });

    if (!deletedComment) {
      throw new Error("somthing went wrong");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, "comment deleted", deletedComment));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
      error: true,
      success: false,
    });
  }
});

const getAllComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const { page = 1, limit = 10 } = req.query;

    // if (!isValidObjectId(videoId)) {
    //   throw new Error("video id invalid");
    // }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new Error("video not found");
    }

    const commentAggregate = await Comments.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        }
      },
      {
        $lookup: {
          from: "Like",
          localField: "_id",
          foreignField: "comment",
          as: "like",
        }
      },
      {
        $addFields: {
          likeCount: {
            $size: "$like",
          },
          owner: {
            $first: "$owner",
          },
          isLiked: {
            $cond: {
              if: {
                $in: [req.user?._id, "$like.likedBy"],
              },
              then: true,
              else: false
            }
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        }
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          likeCount: 1,
          owner: {
            userName: 1,
            firstName: 1,
            "avatar.url": 1,
          },
          isLiked: 1,
        }
      }
    ]);

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const comments = await Comments.aggregatePaginate(
      commentAggregate,
      options
    );

    return res
      .status(200)
      .json(new ApiResponse(201, "all comment fetched", comments));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "somthing went wrong",
    });
  }
});

export { addComment, updateComment, deleteComment, getAllComments };