import { PlayCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const EmptyChannelVideos = () => {
  const status = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.user);
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  if (status && user.userName === userData.userName) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center mt-8">
          <p className="mb-3 w-full">
            <span className="inline-flex rounded-full bg-black">
              <PlayCircle className="text-white" />
            </span>
          </p>
          <h4>Videos uploaded</h4>
          <p>You have yet to upload video. Click to new Upload a video</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-5 py-2 bg-gray-800 text-white rounded-md my-4 hover:bg-gray-900 transition-all"
          >
            New Video
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center my-10">
        <h5>No videos uploaded</h5>
        <p>
          This page has yet to upload a video. Search another page in order to
          find more videos.
        </p>
      </div>
    );
  }
};

export default EmptyChannelVideos;
