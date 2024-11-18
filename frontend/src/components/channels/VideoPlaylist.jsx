import React, { useEffect, useRef, useState } from "react";
import ChannelEmptyPlayList from "./ChannelEmptyPlayList";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import getUserPlayList from "@/fetchDetails/getUserPlaylist";
import loader from "@/assets/loader.gif";
import { Button } from "../ui/button";

const VideoPlaylist = () => {
  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.user.user);
  const { userName } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const dialog = useRef();
  const location = useLocation()
  const playlists = useSelector((state) => state.user.userPlaylist);

  console.log(user)

  useEffect(() => {
    getUserPlayList(dispatch, user._id || userData._id).then(() =>
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
    dialog.current.open()
  }

  let counter = 0
  return (
    <div>
      {playlists.length > 0 ? (
        <div>
          {
            status && userData?.userName === userName && (
              <div className="flex justify-center items-center">
                <Button onClick={popupModal}>
                  New Playlist
                </Button>
              </div>
            )
          }
          <ul className="flex flex-wrap justify-start">
            {
              playlists.map((playlist) => {
                if( playlist.videosCount > 0 || (status && userData.userName === userName) ){
                  counter++;
                  return(
                    <li key={playlist._id}>
                      <Link to={`/playlist/${playlist._id}`}>
                        <p>{playlist.content}</p>
                      </Link>
                    </li>
                  )
                }
              })
            }
          </ul>
        </div>
      ) : <ChannelEmptyPlayList />}
      <ChannelEmptyPlayList />
    </div>
  );
};

export default VideoPlaylist;
