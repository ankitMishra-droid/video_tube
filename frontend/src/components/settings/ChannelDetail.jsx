import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChannelDetail = () => {
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  if (status) {
    return (
      <div>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/3">
            <h2 className="text-lg sm:text-2xl font-semibold">Channel Info</h2>
            <p>username cannot be change</p>
          </div>
          <div className="w-full md:w-2/3 border border-gray-500 p-2 rounded-md">
            <div>
              <p className="text-xl font-semibold">Username: <span className="font-normal">@{user?.userName}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <p>please login to access this page</p>
        <Link to={"/login"} className="text-blue-700 hover:text-blue-900 hover underline">Login</Link>
      </div>
    );
  }
};

export default ChannelDetail;
