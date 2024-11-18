import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playlist: null
}

const playlistSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setPlaylists: (state, action) => {
            state.playlist = action.payload
        },
        updatePlaylists: (state, action) => {
            state.playlist = state.playlist.map((playlist) => playlist._id === action.payload.playlistId ? {
                ...playlist,
                isVideoPresent: action.payload.isVideoPresent
            } : playlist)
        }
    }
})

export const {setPlaylists, updatePlaylists} = playlistSlice.actions

export default playlistSlice.reducer;