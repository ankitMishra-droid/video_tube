import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const UserToken = mongoose.model("UserToken", tokenSchema);