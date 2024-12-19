import DashboardStats from "@/components/dashboard/DashboardStats";
import VideoPanel from "@/components/dashboard/VideoPanel";
import {
  getChannelVideos,
  getDashboardStats,
} from "@/fetchDetails/getDashBoard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingGif from "@/assets/loader.gif"
import { Link } from "react-router-dom";

const Dashboard = () => {
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChannelVideos(dispatch, user?._id).then(() => setLoading(false));
    getDashboardStats(dispatch, user?._id).then(() => setLoading(false));
  }, []);

  const stats = useSelector((state) => state.dashboard.stats);
  const video = useSelector((state) => state.dashboard.videos);
  // console.log(video);

  if(!status){
          return(
              <div className='flex flex-col mt-10 justify-center items-center gap-3'>
                  <p className='text-lg'>
                      For track your watch history please login.
                  </p>
                  <Link to="/login" className='text-blue-600 hover:text-blue-800 hover:underline'>Login</Link>
              </div>
          )
      }
  return (
    <div>
      <DashboardStats stats={stats} />
      {loading ? (
        <div className="flex items-center justify-center my-5">
          <img src={LoadingGif} className="w-14 h-14" alt="loading img"/>
        </div>
      ) : (
        <VideoPanel channelVideos={video} />
      )}
    </div>
  );
};

export default Dashboard;
