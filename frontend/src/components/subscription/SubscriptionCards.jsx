import fetchApi from "@/common";
import { toggleUserSubscribed } from "@/features/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { BellIcon, CheckCircle } from "lucide-react";

const SubscriptionCards = ({ profile }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const status = useSelector((state) => state.auth.status);

  const toggleSubscribe = async () => {
    if (!status) {
      return (
        <div className="flex items-center">
          <p>
            please login first <Link to={"/login"}>Login Now</Link>
          </p>
        </div>
      );
    } else {
      try {
        const response = await fetch(
          `${fetchApi.getUserSubscriber.url}/c/${profile._id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const resData = await response.json();
        if (resData.data) {
          dispatch(
            toggleUserSubscribed({
              profileId: profile._id,
              isSubscribed: !profile?.isSubscribed,
              subscribersCount: profile?.isSubscribed
                ? profile.subscribersCount - 1
                : profile?.subscribersCount + 1,
            })
          );
        }
      } catch (error) {
        if (error.status === 403) {
          toast.error("You cannot subscribe you rown channel");
        } else {
          toast.error("error while subscribe");
          console.log(error);
        }
      }
    }
  };

  return (
    <li key={profile._id} className="flex justify-between my-2">
      <div className="flex items-center gap-x-3">
        <div className="h-12 w-12 shrink-0">
          <Link to={`/channel/${profile?.userName}`}>
            <img
              src={profile?.avatar}
              alt="profile img"
              className="h-full w-full object-cover rounded-full"
            />
          </Link>
        </div>
        <div className="block">
          <h6 className="font-semibold">
            {profile?.firstName} {profile?.lastName}
          </h6>
          {/* <p>{profile?.subscribersCount}</p> */}
        </div>
      </div>
      <Button
        onClick={toggleSubscribe}
        className={`flex h-9 items-center px-2 rounded-lg ${
          profile?.isSubscribed ? "hover:bg-red-600" : "hover:bg-gray-700"
        } ${
          profile?.isSubscribed
            ? "bg-red-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        {profile?.isSubscribed ? (
          <>
            <p>Subscribed</p>
            <span>
              <CheckCircle />
            </span>
          </>
        ) : (
          <>
            <p>Subscribe</p>
            <span>
              <BellIcon />
            </span>
          </>
        )}
      </Button>
    </li>
  );
};

export default SubscriptionCards;
