import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.model.js";

const verifyJWT = asyncHandler(async (req, __, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(404, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const checkUser = asyncHandler(async (req, _, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decodedToken) {
        next();
      }

      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

      if(!user){
        next()
      }

      req.user = user;
    }

    next()
  } catch (error) {
    throw new ApiError(401, "Invalid access token", error);
  }
});

export { verifyJWT, checkUser };
