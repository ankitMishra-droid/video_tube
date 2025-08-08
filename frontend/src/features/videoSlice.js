import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    video: null
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.video = action.payload
        },
        updateViews: (state, action) => {
            state.video[0].views += 1;
        }
    }
})

export const { setVideo, updateViews } = videoSlice.actions;
export default videoSlice.reducer;