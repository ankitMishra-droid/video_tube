import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tweets: [],
};

const tweetsSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    setTweets: (state, action) => {
      state.tweets = [...state.tweets, ...action.payload];
    },
    removeTweets: (state, action) => {
      state.tweets = [];
    },
    updateTweets: (state, action) => {
      state.tweets = state.tweets.map((tweet) =>
        tweet._id === action.payload._id ? action.payload : tweet
      );
    },
    deleteTweets: (state, action) => {
      state.tweets = state.tweets.filter(
        (tweet) => tweet._id !== action.payload
      );
    },
    toggleLikeTweet: (state, action) => {
      state.tweets = state.tweets.map((tweet) =>
        tweet._id === state.tweets.tweetId
          ? {
              ...tweet,
              isLiked: action.payload.isLiked,
              likesCount: action.payload.likesCount,
            }
          : tweet
      );
    },
  },
});

export const {
  setTweets,
  removeTweets,
  updateTweets,
  deleteTweets,
  toggleLikeTweet,
} = tweetsSlice.actions;
export default tweetsSlice.reducer;
