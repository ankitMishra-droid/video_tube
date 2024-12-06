import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: null,
    stats: null
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setVideo : (state, action) => {
            state.videos = action.payload
        },
        setStats: (state, action) => {
            state.stats = action.payload
        },
        updateVideoPublishStatus: (state, action) => {
            state.videos = state.videos.map((video) => (
                video._id === action.payload.videoId ? { ...video, isPublished: action.payload.isPublished } : video
            ))
        },
        deleteVideo: (state, action) => {
            state.videos = state.videos.filter((video) => video._id !== action.payload.videoId)
        },
        addVideoStats: (state, action) => {
            state.stats.totalVideos = state.stats.totalVideos + 1
        }
    }
})

export const { setStats, setVideo, updateVideoPublishStatus,deleteVideo, addVideoStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;