import React, { useEffect, useState } from "react";
import EmptyChannelVideos from "./EmptyChannelVideos";
import { useDispatch, useSelector } from "react-redux";
import { removeUserVideos } from "@/features/userSlice";
import { getUserVideo } from "@/fetchDetails/getUserVideos";
import loader from "@/assets/loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "../video/VideoCard";

const ChannelVideos = () => {
  
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("desc");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.user?.user?._id);

  useEffect(() => {
    if (page === 1) {
      dispatch(removeUserVideos());
    }
    getUserVideo(dispatch, userId, sortType, page).then((data) => {
      setLoading(false);
      if (data.length !== 10) {
        setHasMore(false);
      }
    });
  }, [userId, sortType, page]);

  const videos = useSelector((state) => state?.user?.userVideo);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center mt-10">
        <img src={loader} alt="loader" width={80} height={80} />
      </span>
    );
  }
  return videos && videos.length < 1 ? (
    <div>
      <EmptyChannelVideos />
    </div>
  ) : (
    <div className="overflow-auto mt-2">
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center h-7 mt-1`">
            <img src={loader} width={60} height={60} alt="loaderGif" />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex mx-2">
          <button
            type="button"
            className={`px-3 ${
              sortType === "desc" ? "bg-pink-500" : "bg-slate-700"
            }`}
            onClick={() => {
              setSortType("desc");
              setPage(1);
              setLoading(true);
            }}
          >
            Latest
          </button>
          <button
            type="button"
            className={`px-3 ${
              sortType === "asc" ? "bg-pink-500" : "bg-slate-700"
            }`}
            onClick={() => {
              setSortType("desc");
              setPage(1);
              setLoading(true);
            }}
          >
            Oldest
          </button>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-3 gap-2 ${videos?.length < 4 && "sm:grid-cols-[repeat(auto-fit, _minmax(300px, 0.34fr))] 2xl:grid-cols-[repeat(auto-fit, _minmax(300px, 0.24fr))]"}`}>
          {
            videos.map((video) => (
              <VideoCard 
                key={video?._id+1}
                video={video}
                name={false}
              />
            ))
          }
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ChannelVideos;
