import React, { useEffect, useRef, useState } from "react";
import ChannelEmptyPlayList from "./ChannelEmptyPlayList";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import getUserPlayList from "@/fetchDetails/getUserPlaylist";
import loader from "@/assets/loader.gif";
import { Button } from "../ui/button";
import playlistImg from "../../assets/playlist.jpg";
import formatDate from "@/helpers/formatDate";

const VideoPlaylist = () => {
  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.user.user);
  const { userName } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const dialog = useRef();
  const location = useLocation();
  const playlists = useSelector((state) => state.user.userPlaylist);

  useEffect(() => {
    getUserPlayList(dispatch, user?._id || userData._id).then(() =>
      setLoading(false)
    );
  }, [userName]);

  if (loading) {
    return (
      <div className="flex justify-center items-cente">
        <img src={loader} className="w-10 h-10" />
      </div>
    );
  }

  const popupModal = () => {
    dialog.current.open();
  };

  let counter = 0;
  return (
    <div>
      {playlists.length > 0 ? (
        <div>
          {status && userData?.userName === userName && (
            <div className="flex justify-center items-center my-5">
              <Button onClick={popupModal}>New Playlist</Button>
            </div>
          )}
          <ul className="flex flex-wrap justify-start">
            {playlists.map((playlist) => {
              if (
                playlist.videosCount > 0 ||
                (status && userData.userName === userName)
              ) {
                counter++;
                return (
                  <li
                    key={playlist._id}
                    className="hover:bg-zinc-900 2xl:w-[18vw] md:w-[25vw] w-[90vw] text-white rounded-md my-4 mx-2 p-1"
                  >
                    <Link to={`/playlist/${playlist._id}`}>
                      <div className="relative">
                        <img
                          src={playlistImg}
                          alt="image"
                          className="w-full md:h-[15vw] 2xl:h-[12hw] object-cover rounded-md"
                        />
                        <div className="absolute inset-x-0 bottom-0">
                          <div className="relative border-t bg-white/30 px-4 py-2 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                            <div className="relative z-[1]">
                              <p className="flex justify-between">
                                <span className="inline-block text-white">
                                  {playlist.description}
                                </span>
                                <span className="inline-block text-center">
                                  {playlist.totalVideos} video
                                  {playlist.totalVideos > 1 ? "s" : ""}
                                </span>
                              </p>
                              <p className="">
                                <span className="inline-block text-center">
                                  {playlist.totalViews} views
                                  {playlist.totalViews > 1 ? "s" : ""}{" "}
                                  {formatDate(
                                    playlist.createdAt
                                      ? playlist.createdAt
                                      : playlist.updatedAt
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      ) : (
        <ChannelEmptyPlayList />
      )}
    </div>
  );
};

export default VideoPlaylist;
