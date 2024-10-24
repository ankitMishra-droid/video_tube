import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose, { isValidObjectId, mongo } from "mongoose";

const toggleSubscription = asyncHandler( async(req, res) => {
    try {
        const { channelID } = req.params;

        // console.log(channelID)
        if(!isValidObjectId(channelID)){
            throw new Error("invalid id")
        }

        const existedSubcription = await Subscription.findOne({
            subscriber: req.user?._id,
            channel: channelID
        })

        if(existedSubcription){
            await Subscription.findByIdAndDelete(existedSubcription?._id)

            return res.status(200).json(
                new ApiResponse(201, "Unsubscribed", { subscribed: false })
            )
        }

        await Subscription.create({
            subscriber: req.user?._id,
            channel: channelID
        })

        return res.status(200).json(
            new ApiResponse(201, "Subscribed", { subscribed: true })
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

const getSubscribedChannels = asyncHandler( async(req, res) => {
    try {
        const { subscribedId } = req.params;
    
        if(!isValidObjectId(subscribedId)){
            throw new Error("invalid id")
        }

        const id = new mongoose.Types.ObjectId(subscribedId)
    
        const subscribe = await Subscription.aggregate([
            {
                $match: { subscriber: id }
            },
            {
                $project: {
                    channel: 1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "subscriptionChannel"
                }
            }
        ])
    
        return res.status(200).json(
            new ApiResponse(201, "subscribed channels", subscribe)
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

const getUserChannelSubscribers = asyncHandler(async( req, res) => {
    try {
        const { channelID } = req.params;

        if(!isValidObjectId(channelID)){
            throw new Error("invalid id")
        }

        const subscriber = await Subscription.aggregate([
            {
                $match: { channel: new mongoose.Types.ObjectId(channelID) }
            }
        ])

        return res.status(200).json(
            new ApiResponse(201, "Fetch subscribers details successfully", subscriber)
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

export { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers }