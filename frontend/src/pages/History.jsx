import VideoListCard from "@/components/video/VideoListCard";
import { fetchHistory } from "@/fetchDetails/getUserHistory";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import loadingGif from "@/assets/loader.gif"

const History = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state?.auth?.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  console.log(authStatus);
  useEffect(() => {
    if (authStatus) {
      fetchHistory(dispatch).then(() => setLoading(false));
    }
  }, [authStatus]);

  const history = useSelector((state) => state.user.userHistory);

  console.log(history?.[0]?.[0]);

  if (!authStatus) {
    return (
      <div className="flex flex-col mt-10 justify-center items-center gap-3">
        <p className="text-lg">For track your watch history please login.</p>
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }
  return (
    <div>
      {loading ? (
        <div className="flex justify-center mt-20">
            <img src={loadingGif} className="w-16 h-16" alt="loadingGif"/>
        </div>
      ) : (
        <div className="">
          {history?.[0]?.map((video) => (
            <div key={video?._id}>
              <VideoListCard
                video={video}
                imgSize={`w-full h-full sm:w-[40vw] sm:h-[25vw] lg:w-[28vw] lg:h-[30vh]`}
                description={video?.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
