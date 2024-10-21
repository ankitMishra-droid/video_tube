import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.model.js";
import { Video } from "../models/video.model.js";
import crypto from "crypto";
import mongoose, { isValidObjectId } from "mongoose";

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

const getAllVideos = asyncHandler( async(req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

        const sortByField = ["createdAt", "duration", "views"];
        const sortTypeArr = ["asc", "dsc"];

        const getVideo = await Video.aggregate([
            {
                $match: {
                    $or: [
                        {
                            onwer: userId ? new mongoose.Types.ObjectId(userId) : null
                        },
                        {
                            $and: [
                                { isPublished: true },
                                {
                                    $or: [
                                        {
                                            title: query ? { $regex: query, $options: "i" } : { $exists: true }
                                        },
                                        {
                                            description: query ? { $regex: query, $options: "i" } : null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project:{
                                userName: 1,
                                firstName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    [sortBy]: sortType === "dsc" ? -1 : 1
                }
            },
            {
                $addFields: {
                    owner: {
                        $first: "$owner"
                    }
                }
            }
        ])

        const result = await Video.aggregatePaginate(getVideo, {
            page,
            limit,
            customLabels: {
                totalDocs: "totalVideos",
                docs: "Videos",
            },
            allowDiskUse: true
        })

        if(result.totalPages === 0){
            throw new ApiError(404, "videos not found")
        }

        return res.status(200).json(
            new ApiResponse(201, "vidoes fetched.", result)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiError(500, "somthing went wrong")
        )
    }
})

const getVideoById = asyncHandler( async(req, res) => {
    try {
        const { videoId } = req.params;

        if(!isValidObjectId(videoId)){
            throw new ApiError(404, "invalid videoID")
        }

        const userId = req.user?._id;
        if(!userId){
            throw new ApiError(404, "invalid user")
        }

        const fetchVideo = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "like",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from:"User",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $lookup: {
                                from: "Subscription",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscribers" 
                            },
                        },
                        {
                            $addFields: {
                                subscriberCount: {
                                    $size: "$subscribers"
                                },
                                isSubscribed: {
                                    $cond: {
                                        $if: {
                                            $in:[
                                                req.user._id,
                                                "$subscribers.subscriber"
                                            ]
                                        },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                userName: 1,
                                "avatar.url": 1,
                                subscriberCount: 1,
                                isSubscribed: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    likeCount: {
                        $size: "$likes"
                    },
                    owner: {
                        $first: owner
                    },
                    isLiked:{
                        $cond: {
                            $if: {
                                $in: [
                                    req.user?._id, "$likes.likedBy"
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    "videoFile.url":1,
                    title : 1,
                    description: 1,
                    createdAt :1,
                    views: 1,
                    subscriberCount: 1,
                    likeCount: 1,
                    isLiked: 1,
                    duration: 1,
                    commetns: 1  
                }
            }
        ])

        if(!fetchVideo){
            throw new ApiError(404, "video dosen't availabe")
        }

        // increase views
        await Video.findByIdAndUpdate(
            videoId, {
                $inc: {views: 1}
            }
        );

        // store watchHistory
        await Video.findByIdAndUpdate(req.user?._id, {
            $addToSet: {
                watchHistory: videoId
            }
        })

        return res.status(200).json(
            new ApiResponse(201, "video fetched", fetchVideo)
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiError(500, "something went wrong")
        )
    }
})

export { publishVideo, getAllVideos, getVideoById };
