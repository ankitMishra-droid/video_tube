import formatDuration from "@/helpers/formatDuration";
import getTimeDistance from "@/helpers/getTimeDistance";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const VideoCard = ({ video, name = true }) => {
  const videoLength = formatDuration(parseInt(video?.duration));
  const uploadedTime = getTimeDistance(video?.createdAt);
  const navigate = useNavigate();

  const handdleLink = (e) => {
    e.preventDefault();
    navigate(`channel/${video?.owner?.userName}`);
  };
  return (
    <>
      <Link
        to={`/video/${encodeURIComponent(video?.title)}/${video?._id}`}
        className="shadow-lg hover:shadow-2xl transition-all rounded-xl h-full text-black border"
      >
        <div
          key={video?._id}
          className="rounded-xl text-black p-1` hover:bg-slate-200 h-full align-middle"
        >
          <div className="w-full relative inset-0 pt-[55%]">
            <div className="absolute inset-0">
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className="w-full h-full object-cover mb-2 rounded-xl border border-gray-800"
              />
            </div>
            <p className="absolute bottom-1 right-3 bg-gray-950/75 px-1 text-gray-100 rounded text-sm">{videoLength}</p>
          </div>
          <div className="flex justify-start mt-2 mb-2 mx-2">
            <div onClick={handdleLink} className="mt-1 flex-shrink-0">
              <img
                src={video?.owner?.avatar}
                className="rounded-full w-8 h-8 object-cover bg-white"
              />
            </div>
            <div className="ml-4">
              <h2
                className="text-base font-semibold line-clamp-2"
                title={video?.title}
              >
                {video?.title}
              </h2>
              {name && (
                <h2 className="text-gray-600 text-sm">
                  {video?.owner?.firstName} {video?.owner?.lastName}
                </h2>
              )}
              <p className="text-gray-500 text-sm">{`${video?.views} views | ${uploadedTime}`}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
