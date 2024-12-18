import fetchApi from "@/common";
import GuestComponent from "@/components/guest/GuestComponent";
import VideoListCard from "@/components/video/VideoListCard";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import loadingGif from "@/assets/loader.gif"
import VideoChannels from "@/components/video/VideoChannels";

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [moreData, setMoreData] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Using useLocation to get query parameters from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");  // Get the 'query' parameter from the URL
  const [prevQuery, setPrevQuery] = useState("");

  const fetchSearchVideos = async (page) => {
    setError("");
    try {
      const response = await fetch(
        `${fetchApi.getAllVideos.url}?query=${query}&page=${page}&limit=10`,
        {
          method: fetchApi.getAllVideos.method,
          credentials: "include",
        }
      );

      const resData = await response.json();
      console.log(resData?.data);
      if (resData?.data.length > 0) {
        setVideos((prev) => [...prev, ...resData?.data]);
        if (resData?.data.length !== 10) {
          setMoreData(false);
        }
      } else {
        setMoreData(false);
        setError(
          <GuestComponent
            title="Video not found"
            subtitle="something went wrong! while fetching videos or maybe deleted or not found."
            guest={true}
          />
        );
      }
    } catch (error) {
        setError(
            <p className="text-center mt-10 font-semibold text-lg">
                An error occured while fetching videos
            </p>
        )
      console.log(`error while searching videos, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query !== prevQuery) {
      setVideos([]);
      setPage(1);
      setMoreData(true);
      setLoading(true);
    }
    if (query) {
      fetchSearchVideos(1);
    }
    setPrevQuery(query);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      fetchSearchVideos(page);
    }
  }, [page]);

  const fetchMoreVideos = () => {
    if (moreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  return (
    <div>
      {loading ? (
        <span className="flex items-center justify-center mt-5">
          <img src={loadingGif} className="w-10 h-10" alt="loading-img" />
        </span>
      ) : (
        <div>
          {error ? (
            error
          ) : (
            <div>
            <InfiniteScroll
              dataLength={videos.length}
              next={fetchMoreVideos}
              hasMore={moreData}
              loader={
                <div className="flex items-center justify-center my-5">
                  <img src={loadingGif} className="w-9 h-9" alt="loading-img" />
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {videos.map((video) => (
                <div key={video?._id}>
                  <VideoListCard video={video} description={video?.description} imgSize={"w-full h-full sm:w-[40vw] sm:h-[25vw] lg:w-[28vw] lg:h-[30vh]"}/>
                </div>
              ))}
            </InfiniteScroll>
            {/* <div>
                <VideoChannels videos={videos} />
            </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
