import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userVideo: [],
    userTweets: [],
    userLikedVideos: [],
    userPlaylist: null,
    userSubscribed: null,
    userHistory: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
        },
        addUserTweets: (state, action) => {
            state.userTweets = [...state.userTweets, ...action.payload];
        },
        removeUserTweetes: (state, action) => {
            state.userTweets = [];
        },
        addUserVideos: (state, action) => {
            state.userVideo = [...state.userVideo, ...action.payload];
        },
        removeUserVideos: (state,action) => {
            state.userVideo = [];
        },
        addLikedVideos: (state, action) => {
            state.userLikedVideos = [...state.userLikedVideos, action.payload]
        },
        removeLikedVideos: (state, action) => {
            state.userLikedVideos = [];
        },
        addUserHistory: (state, action) => {
            state.userHistory = [...state.userHistory, action.payload];
        },
        removeUserHistory: (state, action) => {
            state.userHistory = [];
        },
        addUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        addUserSubscribed: (state, action) => {
            state.userSubscribed = action.payload
        },
        toggleUserSubscribed: (state, action) => {
            state.userSubscribed.channels = state.userSubscribed.channels.map((profile) => profile._id === action.payload.profileId ? {
                ...profile,
                isSubscribed: action.payload.isSubscribed,
                subscribersCount: action.payload.subscribersCount
            } : profile
        )
        }
    }
})

export const {addUser, addUserHistory, addLikedVideos, addUserPlaylist, addUserSubscribed, addUserTweets, addUserVideos, removeLikedVideos, removeUserHistory, removeUserTweetes, removeUserVideos, toggleUserSubscribed} = userSlice.actions;

export default userSlice.reducer;