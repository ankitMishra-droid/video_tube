import { asyncHandler } from "../utils/asyncHandlers.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlis.model.js"
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler( async(req, res) => {
    try {
        const { content, description } = req.body;

        if(!(content || description)){
            throw new Error("these fields are required")
        }

        const video = await Playlist.create({
            content: content,
            description: description,
            owner: req.user?._id
        })

        if(!video){
            throw new Error("there is an error while creating playlist")
        }

        return res.status(200).json(
            new ApiResponse(201, "playlist created", video)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const getUserPlaylists = asyncHandler( async(req, res) => {
    try {
        const { userId } = req.params;

        if(!isValidObjectId(userId)){
            throw new Error("invalid id")
        }

        const getPlaylist = await Playlist.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videos"
                }
            },
            {
                $addFields: {
                    totalVideos: {
                        $size: "$videos"
                    },
                    totalViews: {
                        $sum: "$videos.views"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    userName: 1,
                    description: 1,
                    totalVideos: 1,
                    totalViews: 1,
                    updatedAt: 1
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(201, "user playlist fetched", getPlaylist)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const getPlaylistById = asyncHandler( async(req, res) => {
    try {
        const { playlistId } = req.params;

        if(!isValidObjectId(playlistId)){
            throw new Error("invalid playlist id")
        }

        const playlist = await Playlist.findOne({_id: playlistId}).populate({
            path: "videos",
            populate: { path: "owner", select: "userName firstName avatar"}
        });

        if(!playlist){
            throw new Error("playlist not found")
        }

        return res.status(200).json(
            new ApiResponse(201, "playlist fetched", playlist)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const addVideoToPlaylist = asyncHandler( async(req, res) => {
    try {
        const {playlistId, videoId} = req.params;

        if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
            throw new Error("both id is invalid")
        }

        const playlist = await Playlist.findById(playlistId);
        const video = await Video.findById(videoId)

        if(!playlist){
            throw new Error("playlist not found")
        }

        if(!video){
            throw new Error("playlist not found")
        }

        if(playlist.owner.toString()  && video.owner.toString() != req.user?._id.toString()){
            throw new Error("only owner can add videos")
        }

        const addVideo = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $addToSet: {
                    videos: videoId
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json(
            new ApiResponse(201, "video added to the playlist", addVideo)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const removeVideoFromPlaylist = asyncHandler( async(req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
            throw new Error("invalid id")
        }

        const playlist = await Playlist.findById(playlistId)
        
        if(!playlist){
            throw new Error("playlist not found")
        }

        const video = await Video.findById(videoId);

        if(!video){
            throw new Error("video not found")
        }

        const removeVideo = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: {
                    videos: videoId
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json(
            new ApiResponse(201, "vidoe removed from playlist")
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const deletePlaylist = asyncHandler(async(req, res) => {
    try {
        const { playlistId } = req.params;

        if(!isValidObjectId(playlistId)){
            throw new Error("invalid playlist id")
        }

        const playlist = await Playlist.findById(playlistId);

        if(playlist.owner.toString() != req.user._id.toString()){
            throw new Error("only owner can delete these playlist")
        }

        await Playlist.findByIdAndDelete(playlistId)

        return res.status(200).json(
            new ApiResponse(201, "Playlist deleted successfully", { deleted: true })
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})

const updatePlaylist = asyncHandler( async(req, res) => {
    try {
        const { playlistId } = req.params;
        const { content, description } = req.body;

        if(!isValidObjectId(playlistId)){
            throw new Error("invalid playlist id")
        }

        const findPlaylist = await Playlist.findById(playlistId);

        if(findPlaylist.owner.toString() != req.user?._id.toString()){
            throw new Error("only owner can update playlist")
        }

        const playlist = await Playlist.findByIdAndUpdate(
            findPlaylist?._id,
            {
                $set: {
                    content: content,
                    description: description
                }
            },
            { new: true }
        )

        return res.status(200).json(
            new ApiResponse(201, "playlist updated", playlist)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error?.message || "something went wrong",
            error: true,
            success: false
        })
    }
})
export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }