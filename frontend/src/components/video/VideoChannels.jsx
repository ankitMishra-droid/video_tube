import { Dot } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const VideoChannels = ({ videos }) => {
  const user = useSelector((state) => state.user.user);
  return (
    <div>
      <div className="flex w-full">
        <div className="w-1/2 flex justify-center items-center my-3">
          <Link to={`/channel/${videos?.[0]?.owner?.userName}`}>
            <img
              src={videos?.[0]?.owner?.avatar}
              alt={videos?.[0]?.userName}
              className="w-14 h-14"
            />
          </Link>
        </div>
        <div className="w-1/2">
          <p className="text-lg capitalize font-bold">
            {videos?.[0]?.owner?.firstName} {videos?.[0]?.owner?.lastName}
          </p>
          <p className="flex gap-2">
            <Link to={`/channel/${videos?.[0]?.owner?.userName}`}>
              @{videos?.[0]?.owner?.userName}
            </Link>
            <Dot />
            <span>
              {user?.subscribersCount > 1000 ? (
                <p>{user?.subscribersCount}k</p>
              ) : (
                user?.subscribersCount
              )}{" "}
              subscribers
            </span>
          </p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default VideoChannels;
