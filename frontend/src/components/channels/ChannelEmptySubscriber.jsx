import { User2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChannelEmptySubscriber = () => {
  const status = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state?.user?.user);

  if (status && user?.userName === userData?.userName) {
    return (
      <div className="flex flex-col justify-center items-center my-10">
        <div className="bg-black text-white rounded-full p-3">
          <User2 />
        </div>
        <div className="my-5 text-center">
          <p>No Channel Subscribed</p>
          <p>Subscribe to a channel to get latest videos.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center my-5">
        <div className="flex flex-col justify-center items-center my-10">
          <h5>
            please login first or only the original creater can access this
            channel.
          </h5>
          <p className="py-1 text-blue-600 hover:text-blue-900 hover:underline">
            <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </div>
    );
  }
};

export default ChannelEmptySubscriber;
