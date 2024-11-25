import React, { useEffect, useState } from "react";
import { setUserDetails } from "@/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { getUseProfile } from "@/fetchDetails/getUserProfile";
import GuestComponent from "../guest/GuestComponent";
import { toast } from "react-toastify";
import fetchApi from "@/common";
import { Button } from "../ui/button";
import logo from "@/assets/logo.png";
import userImg from "@/assets/user.png";
import { Edit } from "lucide-react";

// Sub-Component: Profile Header
const ProfileHeader = ({ profile, user, status, navigate, toggleSubscribe }) => (
  <div className="flex flex-wrap gap-4 pb-4 pt-6">
    <span className="-mt-10 relative inline-block">
      <img
        src={userImg}
        alt="user"
        className="rounded-full w-24 h-24 border-orange-700"
      />
    </span>
    <div className="mr-auto inline-block">
      <p className="font-bold text-xl">
        {user?.firstName} <span>{user?.lastName}</span>
      </p>
      <p className="text-sm">@{profile?.userName}</p>
      <p className="text-sm">
        {profile?.subscribersCount} Subscribers .{" "}
        {profile?.channelSubscribedToCount} Subscribed
      </p>
    </div>
    <div>
      {status ? (
        user?.userName === profile?.userName ? (
          <Button onClick={() => navigate("/settings")}>
            <Edit />
            Edit
          </Button>
        ) : (
          <Button onClick={toggleSubscribe}>
            {profile?.isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )
      ) : (
        <Button onClick={() => navigate("/")}>Login</Button>
      )}
    </div>
  </div>
);

// Sub-Component: Scrollable Navigation
const ScrollableNavigation = () => {
  const navigationLinks = [
    { label: "Videos", path: "" },
    { label: "Playlist", path: "playlist" },
    { label: "Tweets", path: "tweets" },
    { label: "About", path: "about" },
  ];

  return (
    <ul className="border-b-2 sticky z-[2] flex flex-row gap-x-4 overflow-auto py-2">
      {navigationLinks.map(({ label, path }) => (
        <li key={path} className="w-full">
          <NavLink
            to={path}
            end={path === ""}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-black bg-black text-white px-2 py-1"
                : "w-full border-black bg-white text-black px-2 py-1"
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

const MyChannel = () => {
  const status = useSelector((state) => state?.auth?.status);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userName } = useParams();

  // Fetch user profile on component mount or dependency change
  useEffect(() => {
    setError("");
    getUseProfile(dispatch, userName).then((data) => {
      if (data) {
        setProfile(data);
      } else {
        setError(
          <GuestComponent
            title={`Channel Doesn't Exist`}
            subtitle="Channel not found!"
            guest={false}
          />
        );
      }
    });
  }, [userName, dispatch]);

  // Handle subscription toggle
  const toggleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${fetchApi.userSubscribe.url}/${profile?._id}`,
        {
          method: fetchApi.userSubscribe.method,
          credentials: "include",
        }
      );
      const dataRes = await response.json();
      if (dataRes.success) {
        setProfile((prev) => ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount: prev.isSubscribed
            ? prev.subscribersCount - 1
            : prev.subscribersCount + 1,
        }));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // If error exists, render error component
  if (error) return error;

  return (
    <div className="relative">
      {/* Profile Banner */}
      <div className="relative min-h-36 w-full pt-9">
        <div className="absolute inset-0 overflow-hidden w-full">
          <img
            src={logo}
            className="object-cover block m-auto py-2"
            width="320"
            height="100"
            alt={profile?.userName}
          />
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-5">
        <ProfileHeader
          profile={profile}
          user={user}
          status={status}
          navigate={navigate}
          toggleSubscribe={toggleSubscribe}
        />
      </div>

      {/* Scrollable Navigation */}
      <ScrollableNavigation />

      {/* Outlet for Sub-Routes */}
      <Outlet />
    </div>
  );
};

export default MyChannel;
