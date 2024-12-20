import fetchApi from "@/common";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderImg from "@/assets/loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "./VideoCard";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);

  const getVideos = async (page) => {
    try {
      const response = await fetch(
        `${fetchApi.getAllVideos.url}?page=${page}&limit=10`,
        {
          method: fetchApi.getAllVideos.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();
      if (resData.data.length > 0) {
        setVideos((prevVideos) => ([...prevVideos, ...resData.data]));
        setLoading(false);
        if (resData.data.length !== 20) {
          setShowMore(false);
        }
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.log("Error in fetching videos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos(page);
  }, [page]);

  const fetchMoreVideos = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-32">
        <img
          src={LoaderImg}
          className="w-28 h-28 inline-block mx-auto"
          alt="loading img"
        />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex justify-center mt-[30vh]">
        <p className="text-2xl text-cyan-900">Videos not found</p>
      </div>
    );
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreVideos}
        hasMore={showMore}
        loader={
          <img
            src={LoaderImg}
            className="w-16 h-16 inline-block mx-auto"
            alt="loaderImg"
          />
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="overflow-hidden mb-2">
          <div
            className={`grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6 ${
              videos.length < 4 &&
              "sm:grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))]"
            }`}
          >
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default VideoContainer;
