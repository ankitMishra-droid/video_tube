export const DB_NAME = "Video_Streaming";

export const isProduction = process.env.NODE_ENV === "production";

export const frontendUrl = isProduction ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;
