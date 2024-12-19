import formatDuration from "@/helpers/formatDuration";
import getTimeDistance from "@/helpers/getTimeDistance";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const VideoListCard = ({ video, description, imgSize }) => {
  const videoLength = formatDuration(parseInt(video?.duration));
  const uploadedTime = getTimeDistance(video?.createdAt);
  const navigate = useNavigate();

  const handdleLink = (e) => {
    e.preventDefault();
    navigate(`/channel/${video?.owner?.userName}`);
  };
  return (
    <>
      <Link
        to={`/video/${video?.title}/${video?._id}`}
        className="bg-black rounded-xl h-full"
      >
        <div
          key={video?._id}
          className="w-full flex flex-col sm:flex-row rounded-xl my-3 text-black p-1 transition-all hover:bg-slate-300 align-middle"
        >
          {/* <div className="grid grid-cols-2 lg:grid-rows-1"> */}
            <div className="relative flex-shrink-0 rounded-xl">
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className={`object-cover rounded-xl ${imgSize}`}
              />
              <p className="absolute bottom-5 right-3 bg-gray-950/75 px-1 rounded text-sm text-white">
                {videoLength}
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col mt-1 mb-4 mx-3 my-3">
              <div className="">
                <h2
                  className="text-lg font-semibold text-wrap line-clamp-2"
                  title={video?.title}
                >
                  {video?.title}
                </h2>
                <p className="text-gray-600 text-sm">{`${video?.views} views | ${uploadedTime}`}</p>
              </div>
              <div
                onClick={handdleLink}
                className="my-2 flex flex-row gap-2 items-center"
              >
                <img
                  src={video?.owner?.avatar}
                  className="rounded-full w-8 h-8 object-cover bg-white"
                />

                <h2 className="text-gray-600 font-semibold text-sm">
                  {video?.owner?.firstName} {video?.owner?.lastName}
                </h2>
              </div>
                <p className="my-2 text-lg line-clamp-1">
                  {description}
                </p>
            </div>
          {/* </div> */}
        </div>
      </Link>
    </>
  );
};

export default VideoListCard;
