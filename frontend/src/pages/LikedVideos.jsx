import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import loadingGif from "@/assets/loader.gif";
import { Link } from "react-router-dom";
import { fetchLikedVideos } from "@/fetchDetails/getLikedVideos";

const LikedVideos = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  if (!authStatus) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center mt-10">
        <p>Please login to like videos</p>
        <Link
          to={"/login"}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (authStatus) {
      fetchLikedVideos(dispatch).then(() => setLoading(false));
    }
  }, [authStatus]);

  const likedVideos = useSelector((state) => state.user.userLikedVideos);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6 sm:grid-cols-[repeat(auto-fit,_minmax(270px,_0.24fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(270px,_0.30fr))]">
        {likedVideos?.[0]?.map((video) => (
          <div
            key={video?._id}
            className="border p-3 rounded-md shadow-lg hover:shadow-2xl transition-all flex flex-col"
          >
            <Link
              to={`/video/${video?.video?.title}/${video?.video?._id}`}
              className="flex flex-col flex-grow"
            >
              {/* Video Thumbnail */}
              <div className="relative w-full pb-[56.25%]">
                <img
                  src={video?.video?.thumbnail}
                  alt={video?.video?.title}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                />
              </div>
              {/* Video Title */}
              <p className="mt-3 font-semibold text-lg text-gray-900 line-clamp-2 flex-grow">
                {video?.video?.title}
              </p>
              {/* User Info */}
              <div className="flex gap-x-3 items-center mt-2 mb-3">
                <Link to={`/channel/${video?.video?.owner?.userName}`}>
                  <img
                    src={video?.video?.owner?.avatar}
                    alt={`${video?.video?.owner?.userName}'s avatar`}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                </Link>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm text-gray-800">
                    {video?.video?.owner?.firstName} {video?.video?.owner?.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{video?.video?.owner?.userName}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
