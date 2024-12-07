import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = asyncHandler(async(requestAnimationFrame, res) => {
    return res.status(200).json(
        new ApiResponse(200, "OK", "Health Check Passed")
    )
})

export {healthCheck}