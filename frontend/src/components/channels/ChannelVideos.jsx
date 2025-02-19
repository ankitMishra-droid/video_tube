import React, { useEffect, useState, useRef } from "react";
import EmptyChannelVideos from "./EmptyChannelVideos";
import { useDispatch, useSelector } from "react-redux";
import { removeUserVideos } from "@/features/userSlice";
import { getUserVideo } from "@/fetchDetails/getUserVideos";
import loader from "@/assets/loader.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "../video/VideoCard";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "lucide-react";

const ChannelVideos = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("desc");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.user?.user?._id);
  const videos = useSelector((state) => state?.user?.userVideo);
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (!userId || initialFetchRef.current) return;

    if (page === 1) {
      dispatch(removeUserVideos());
    }

    setLoading(true);
    getUserVideo(dispatch, userId, sortType, page).then((data) => {
      setLoading(false);
      if (data?.length !== 10) {
        setHasMore(false);
      }
    });

    initialFetchRef.current = true;
  }, [userId, sortType, page, dispatch]);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  const handleSortChange = (type) => {
    if (sortType !== type) {
      setSortType(type);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      initialFetchRef.current = false;
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
    <div className="overflow-auto mt-4">
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
        <div className="flex mx-2 justify-between items-center">
          <div className="flex justify-center items-center flex-col sm:flex-row gap-y-1">
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
          <div>
            <button
              onClick={() => navigate(`/admin/dashboard`)}
              className="flex items-center gap-2 px-2 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all"
            >
             <PlusIcon /> Upload Video
            </button>
          </div>
        </div>
        
        <p className="text-slate-700 font-semibold mt-3">
            Total Videos Uploaded: {videos.length}
          </p>
        <div
          className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 mt-4 ${
            videos?.length < 4 &&
            "sm:grid-cols-[repeat(auto-fit,_minmax(300px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
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
