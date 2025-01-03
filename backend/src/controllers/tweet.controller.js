import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js"
import mongoose, { isValidObjectId, Types } from "mongoose";

const createTweet = asyncHandler( async(req, res) => {
    try {
        const { content } = req.body;

        if(!content){
            throw new Error("please write some tweet")
        }

        const userID = req.user?._id;

        const tweet = await Tweet.create({
            content: content,
            owner: userID
        });

        if(!tweet){
            throw new Error("tweet can't created try again")
        }

        return res.status(200).json(
            new ApiResponse(201, "tweet posted", tweet)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "somthing went wrong",
            error: true,
            success: false
        })
    }
})

const getUserTweets = asyncHandler( async(req, res) => {
    try {
        const { userId } = req.params;
        
        if(!isValidObjectId(userId)) {
            throw new Error("Invlaid id")
        }

        const allTweet = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails",

                    pipeline: [
                        {
                            $project: {
                                userName : 1,
                                "avatar.url": 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "likeDetails",

                    pipeline: [
                        {
                            $project: {
                                likedBy: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    likeCount: {
                        $size: "$likeDetails"
                    },
                    ownerDetails: {
                        $first: "$ownerDetails"
                    },
                    isLiked: {
                        $cond: {
                            if: {$in: [req.user?._id, "$likeDetails.likedBy"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    content: 1,
                    ownerDetails: 1,
                    likesCount: 1,
                    createdAt: 1,
                    isLiked: 1
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(201, "all tweet fetched", allTweet)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "somthing went wrong",
            error: true,
            success: false
        })
    }
})

const updateTweet = asyncHandler( async(req, res) => {
    try {
        const { tweetId } = req.params;
        const { content } = req.body;

        if(!isValidObjectId(tweetId)){
            throw new Error("invalid id")
        }

        const tweet = await Tweet.findById(tweetId)

        if(!tweet){
            throw new Error("tweet not found")
        }

        if(tweet.owner.toString() != req.user?._id.toString()){
            throw new Error("you cannot access to update this tweet")
        }

        const tweetUpdated = await Tweet.findByIdAndUpdate(tweetId, {
            $set: {
                content
            }
        }, { new: true })

        return res.status(200).json(
            new ApiResponse(201, "tweet updated", tweetUpdated)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "somthing went wrong",
            error: true,
            success: false
        })
    }
})

const deleteTweet = asyncHandler( async(req, res) => {
    try {
        const { tweetId } = req.params;

        if(!isValidObjectId(tweetId)){
            throw new Error("Invalid id")
        }

        const tweet = await Tweet.findById(tweetId)

        if(!tweet){
            throw new Error("Tweet not found")
        }

        if(tweet.owner.toString() != req.user?._id.toString()){
            throw new Error("you don't have access to delete this tweet")
        }

        const tweetDelete = await Tweet.findByIdAndDelete(tweetId)

        return res.status(200).json(
            new ApiResponse(201, "tweet deleted", tweetDelete)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "somthing went wrong",
            error: true,
            success: false
        })
    }
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }