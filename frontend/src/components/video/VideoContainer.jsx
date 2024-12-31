import fetchApi from "@/common";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderImg from "@/assets/loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "./VideoCard";
import axiosFetch from "@/helpers/fetchData";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);

  const getVideos = async (page) => {
    try {
      setLoading(true);

      const response = await axiosFetch.get(`/video?page=${page}&limit=20`);

      if (response.data.data.length > 0) {
        // Check if the newly fetched videos are already in the list to avoid duplicates
        setVideos((prevVideos) => {
          const newVideos = response.data.data.filter(
            (newVideo) =>
              !prevVideos.some((prevVideo) => prevVideo._id === newVideo._id)
          );
          return [...prevVideos, ...newVideos];
        });

        if (response.data.data.length < 20) {
          setShowMore(false);
        }
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.log("Error in fetching videos: ", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos(page);
  }, [page]);

  const fetchMoreVideos = () => {
    if (!loading && showMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1 && videos.length === 0) {
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
          <div className="flex justify-center">
            <img
              src={LoaderImg}
              className="w-16 h-16 inline-block mx-auto"
              alt="loading more videos"
            />
          </div>
        }
        endMessage={
          !showMore && (
            <p className="text-center text-xl text-gray-500 mt-4">
              No more videos to load
            </p>
          )
        }
        scrollThreshold={0.95}
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
