import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    }
}, { timestamps: true })

export const Like = mongoose.model("Like", likeSchema)