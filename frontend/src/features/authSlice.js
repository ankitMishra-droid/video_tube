import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.status = true;
            state.user = action.payload;
            // console.log(action.payload)
        },
        removeUserDetails: (state, action) => {
            state.status = false;
            state.user = null;
        }
    }
});

export const { setUserDetails, removeUserDetails } = authSlice.actions;
export default authSlice.reducer;
