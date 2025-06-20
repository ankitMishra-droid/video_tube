import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    loading: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            console.log(action.payload)
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload
            console.log(action.payload)
        },
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
        },
        setUserDetails: (state, action) => {
            state.status = true;
            state.user = action.payload;
            // console.log(action.payload)
        },
        removeUserDetails: (state) => {
            state.status = false;
            state.user = null;
        }
    }
});

export const { setUserDetails, removeUserDetails, setAccessToken, setRefreshToken, logoutUser } = authSlice.actions;
export default authSlice.reducer;
