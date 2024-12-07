import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRoutes = Router();

playlistRoutes.route("/").post(verifyJWT, createPlaylist)
playlistRoutes.route("/u/:userId").get(verifyJWT, getUserPlaylists)
playlistRoutes.route("/p/:playlistId").get(verifyJWT, getPlaylistById)
playlistRoutes.route("/add/:videoId/:playlistId").patch(verifyJWT, addVideoToPlaylist)
playlistRoutes.route("/remove/:videoId/:playlistId").patch(verifyJWT, removeVideoFromPlaylist)
playlistRoutes.route("/delete/:playlistId").delete(verifyJWT, deletePlaylist)
playlistRoutes.route("/update/:playlistId").patch(verifyJWT, updatePlaylist)

export { playlistRoutes }