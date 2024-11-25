import React, { useEffect, useState, useRef } from "react";
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
  const videos = useSelector((state) => state?.user?.userVideo);
  const initialFetchRef = useRef(false); // To prevent redundant fetching on initial render.

  useEffect(() => {
    // Prevent re-fetching on initial render or duplicate calls.
    if (!userId || initialFetchRef.current) return;

    // Clear previous videos on new user/session.
    if (page === 1) {
      dispatch(removeUserVideos());
    }

    // Fetch videos.
    setLoading(true);
    getUserVideo(dispatch, userId, sortType, page).then((data) => {
      setLoading(false);
      if (data.length !== 10) {
        setHasMore(false);
      }
    });

    initialFetchRef.current = true; // Mark as fetched.
  }, [userId, sortType, page, dispatch]);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  const handleSortChange = (type) => {
    if (sortType !== type) {
      setSortType(type);
      setPage(1);
      setHasMore(true); // Reset pagination.
      setLoading(true);
      initialFetchRef.current = false; // Allow fresh fetch.
    }
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
          <div className="flex justify-center h-7 mt-1">
            <img src={loader} width={60} height={60} alt="loaderGif" />
          </div>
        }
      >
        <div className="flex mx-2">
          <button
            type="button"
            className={`px-3 ${
              sortType === "desc" ? "bg-pink-500" : "bg-slate-700"
            }`}
            onClick={() => handleSortChange("desc")}
          >
            Latest
          </button>
          <button
            type="button"
            className={`px-3 ${
              sortType === "asc" ? "bg-pink-500" : "bg-slate-700"
            }`}
            onClick={() => handleSortChange("asc")}
          >
            Oldest
          </button>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-3 gap-2 ${
            videos?.length < 4 &&
            "sm:grid-cols-[repeat(auto-fit,_minmax(300px,_0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,_0.24fr))]"
          }`}
        >
          {videos.map((video) => (
            <VideoCard key={video?._id} video={video} name={false} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ChannelVideos;
