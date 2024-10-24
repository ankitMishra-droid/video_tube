import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserToken } from "../models/Token.js";
import crypto from "crypto"
import sendMail from "../services/nodemailer.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const createUser = asyncHandler(async (req, res) => {
    try {
      const {
          userName,
          firstName,
          lastName,
          email,
          password,
          role,
          avatar,
          coverAvatar,
        } = req.body;
      
        if (!userName) {
          throw new ApiError(400, "Username is required");
        }
        if (!firstName) {
          throw new ApiError(400, "First name is required");
        }
        if (!lastName) {
          throw new ApiError(400, "Last name is required");
        }
        if (!email) {
          throw new ApiError(400, "Email is required");
        }
        if (!password) {
          throw new ApiError(400, "Password is required");
        }
      
        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
      
        if (existingUser) {
          if (existingUser.email === email) {
            throw new ApiError(400, "Email is already registered.");
          }
          if (existingUser.userName === userName) {
            throw new ApiError(400, "Username is already registered.");
          }
        }
      
        // Create new user
        const user = await User.create({
          userName,
          firstName,
          lastName,
          email,
          password, // Password will be hashed in the schema
          role: role || "USER", // Default to "USER" if not provided
          avatar: avatar || "/user_profile/user.png", // Default avatar
          coverAvatar: coverAvatar || "/user_profile/user.png", // Default coverAvatar
        });
      
        const createdUser = await User.findOne({ _id: user._id }).select(
          "-password -refreshToken"
        );
      
        return res
          .status(201)
          .json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
      return res.status(500).json(
        new ApiError(500, {message: error.message || "somthing went wrong"})
      )
    }
});

const loginUser = asyncHandler( async(req, res) => {
  try {
    const {email, password} = req.body;

    if(!email){
      throw new ApiError(404, "email is required.")
    }

    if(!password){
      throw new ApiError(401, "password is required.")
    }

    const user = await User.findOne({email});

    if(!user){
      throw new ApiError(401, "user does not exist.")
    }

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword){
      throw new ApiError(401, "wrong password please try again.")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(201, "user logged in.", {user: loggedInUser, accessToken, refreshToken})
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json(
      new ApiError(500, {message: error.message || "somthing went wrong"})
    )
  }
})

const logout = asyncHandler( async(req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshToken: 1
      }
    },
  {
    new: true
  });

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(201, "user logout", {})
  )
  } catch (error) {
    return res.status(500).json(new ApiError(500, {message: error?.message || "something went wrong"}))
  }
})

const updateProfile = asyncHandler( async(req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const updateUser = await User.findByIdAndUpdate(req.user._id, {
      firstName: firstName,
      lastName: lastName
    },{ new: true }).select("-password")

    return res.status(200).json(
      new ApiResponse(201, "user detail updated", updateUser)
    )

  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error?.message || "somthing went wrong" }))
  }
} )

const changePassword = asyncHandler( async(req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id)
    
    const checkPassword = await user.isPasswordCorrect(oldPassword)

    if(!checkPassword){
      throw new ApiError(401, "password is incorrect.")
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false})

    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse(201, "Password changed successfully.", {})
    )
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, { message: error?.message || "somthing went wrong" })
    )
  }
})

const getCurrentUser = asyncHandler( async(req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json(
      new ApiResponse(201, "current user fetched successfully", user)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, { message: error?.message || "somthing went wrong" })
    )
  }
})

const refreshAccessToken = asyncHandler( async(req, res) => {
  try {
    const incommingRequest = req.cookies.refreshToken || req.body.refreshToken;

    if(!incommingRequest) {
      throw new ApiError(401, "Unauthoried token")
    }

    const decodedToken = jwt.verify(incommingRequest, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);

    if(!user){
      throw new ApiError(401, "invalid refresh token.")
    }

    if(incommingRequest !== user.refreshToken ){
      throw new ApiError(401, "refresh token epired or used.")
    }

    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(201, "Access token refreshed", user)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, { message: error?.message || "somthing went wrong" })
    )
  }
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
  try {
    const { username } = req.params;

    if(!username?.trim()){
      throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
      {
        $match: {
          userName: username?.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo"
        }
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers"
          },
          channelSubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribed: {
            $cond: {
              if: {$in: [req.user?._id, "$subscribers.subscriber"]},
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          firstName: 1,
          userName: 1,
          subscribersCount: 1,
          channelSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverAvatar: 1,
          email: 1
        }
      }
    ])

    if(!channel?.length){
      throw new ApiError(400, "channel does not exist.")
    }

    return res.status(200).json(
      new ApiResponse(201, "fetched channel", channel[0])
    )

  } catch (error) {
    return res.status(500).json(
      new ApiError(500, { message: error?.message || "somthing went wrong" })
    )
  }
})

const getWatchHistory = asyncHandler( async(req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      userName: 1,
                      avatar: 1
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner"
                }
              }
            }
          ]
        }
      }
    ])

    return res.status(200).json(
      new ApiResponse(201, "watch history fetched.", user)
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json(
      new ApiError(500, "somthing went wrong")
    )
  }
})

const sendResetLink = asyncHandler( async(req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({email: email});

    if(!user){
      throw new ApiError(401, "User does not find.")
    }

    const token = await UserToken.findOne({ userId: user?._id});

    if(!token){
      token = await new UserToken({
        userId: user?._id,
        token: crypto.randomBytes(32).toString("hex")
      }).save();
    }

    const link = `${process.env.CORS_ORIGIN}/reset-password/${user?._id}/${token.token}`

    await sendMail(
      email,
      `reset password link from "Youtube"`,
      `${link}\n click to link and reset password`
    )

    return res.status(200).json(
      new ApiResponse(201, `reset password link sent to your registered email: ${email}`, token)
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json(
      new ApiError(500, "somthing went wrong")
    )
  }
})

const passwordReset = asyncHandler( async(req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if(!user){
      throw new ApiError(401, "Invalid link or expired link")
    }

    const token = await UserToken({
      userId: user._id,
      token: req.params.token
    })

    if(!token){
      throw new ApiError(401, "Invalid link or expired link")
    }

    user.password = req.body.password;

    await user.save();
    await token.deleteOne()

    return res.status(200).json(
      new ApiResponse(201, "password reset successfully", token)
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      meessage: error?.message || "something went wrong",
      error: true,
      success: false
    })
  }
})

export { createUser, loginUser, logout, updateProfile, changePassword, getCurrentUser, refreshAccessToken, getUserChannelProfile, getWatchHistory, sendResetLink, passwordReset };
