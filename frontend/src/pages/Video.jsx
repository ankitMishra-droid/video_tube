import fetchApi from "@/common";
import GuestComponent from "@/components/guest/GuestComponent";
import { setVideo } from "@/features/videoSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import loadingImg from "@/assets/loader.gif";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/videoInfo";
import Comment from "@/components/Comment";
import VideoListCard from "@/components/video/VideoListCard";
import axiosFetch from "@/helpers/fetchData";

const Video = () => {
  const { videoTitle, videoId } = useParams();
  const [loading, setLoading] = useState(true);
  const video = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const status = useSelector((state) => state.auth.status);

  const fetchVideo = async () => {
    setError("");
    try {
      const response = await axiosFetch.get(`/video/${videoId}`);

      if (response?.data?.data) {
        dispatch(setVideo(response.data.data));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Video dosen't exist."
          subtitle="User may be deleted or moved."
        />
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideo = async() => {
    try {
      const response = await axiosFetch.get(`/video?sortBy=views&limit=15`)

      if(response?.data?.data){
        setVideos(response?.data?.data)
      }
    } catch (error) {
      console.log('error while fetching related videos, ', error)
    }
  }
  useEffect(() => {
    fetchVideo();
    fetchRelatedVideo()
  }, [videoId, videoTitle, status]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center my-10">
          <img src={loadingImg} className="w-20 h-20" alt="loadngImg" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          <div className="flex flex-col lg:w-[60%]">
            <div className="w-full border rounded-md border-black p-1">
              <VideoPlayer
                key={video?.[0]?._id}
                videoFile={video?.[0]?.videoFile}
              />
            </div>
            <div>
              <VideoInfo video={video} />
            </div>
            <div>
              <Comment video={video} />
            </div>
          </div>
          <div className="lg:w-[40%]">
            {
              videos?.filter((video) => video?._id !== videoId)
              .map((video) => (
                <VideoListCard key={video?._id} video={video} imgSize={"w-full h-full sm:w-[40vw] sm:h-[25vw] lg:w-[15vw] lg:h-[11vw]"}/>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
