import SubscriptionCards from "@/components/subscription/SubscriptionCards";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import loadingGif from "@/assets/loader.gif";
import fetchApi from "@/common";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "@/components/video/VideoCard";

const Subscription = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [moreData, setMoreData] = useState(true);

  const subscribe = useSelector(
    (state) => state.user.userSubscribed?.channels || []
  );

  const getSubscribedVideos = async (page) => {
    try {
      const response = await fetch(
        `${fetchApi.getAllVideos.url}/s/subscription?page=${page}&limit=20`,
        {
          method: fetchApi.getAllVideos.method,
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (resData?.data) {
        setVideos((prevVideos) => [...prevVideos, resData.data]);
        setLoading(false);
        if (resData.data.length !== 20) {
          setMoreData(false);
        }
      }
    } catch (error) {
      console.log(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus) {
      getSubscribedVideos(page);
    }
  }, [page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!authStatus) {
    return (
      <div className="flex flex-col justify-center items-center gap-1 mt-10">
        please login to access this page
        <Link
          to={"/login"}
          className="text-blue-600 hover:text-blue-900 transition-all hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-16">
        <img src={loadingGif} className="w-20 h-20" alt="loading_img" />
      </div>
    );
  }

  if (videos?.[0].length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <p>"No videos available"</p>
        <p>Either you don't subscribe or channel dosn't upload video yet.</p>
      </div>
    );
  }

  console.log(videos)

  return (
    <div className="overflow-auto">
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreData}
        hasMore={moreData}
        loader={
          <div className="flex justify-center items-center">
            <img
              src={loadingGif}
              className="w-16 h-16 mt-8"
              alt="loading_img"
            />
          </div>
        }
        scrollableTarget="scrollabelDiv"
      >
        <div className="overflow-hidden mb-2 mx-2">
          <div
            className={`grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6 ${
              videos.length < 4 &&
              "sm:grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))]"
            }`}
          >
            {
                videos?.[0].map((video) => (
                    <VideoCard key={video?._id} video={video}/>
                ))
            }
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Subscription;
