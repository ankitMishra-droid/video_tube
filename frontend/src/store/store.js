import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/features/authSlice";
import userSlice from "@/features/userSlice";
import videoSlice from "@/features/videoSlice"
import dashboardSlice from "@/features/dashboardSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        video: videoSlice,
        dashboard: dashboardSlice
    }
});
