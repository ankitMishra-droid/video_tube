import mongoose, { Schema } from "mongoose";

const trackView = new Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        requried: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastWatchedAt: {
        type: Date,
        default: Date.now
    },
    watchedDuration: {
        type: Number,
        default: 0
    }
})

export const View = mongoose.model("View", trackView)