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

const restrictUser = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this route.",
      });
    }

    return next();
  };
};

export { verifyJWT, restrictUser };
