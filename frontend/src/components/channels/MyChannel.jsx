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

const MyChannel = () => {
  const { status, user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useParams();

  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getUseProfile(dispatch, userName).then((data) => {
      if (data) {
        setProfile(data);
      } else {
        setError(
          <GuestComponent
            title={`Channel Dosn't exist`}
            subtitle="Channel not found!"
            guest={false}
          />
        );
      }
    });
  }, [status, user]);

  const toggleSubcribe = async (e) => {
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
        setProfile({
          ...profile,
          isSubscribed: !profile.isSubscribed,
          subscribersCount: profile.isSubscribed
            ? profile.subscribersCount - 1
            : profile.subscribersCount + 1,
        });
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <div className="relative min-h-36 w-full pt-9">
        <div className="absolute inset-0 overflow-hidden w-full">
          <image src={logo} className="object-cover" alt={profile?.userName} />
        </div>
      </div>
      <div className="px-5">
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
          <div className="">
            {status === true ? (
              <>
                {user?.userName === profile?.userName ? (
                  <Button onClick={() => navigate("/settings")}>
                    <Edit />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button onClick={toggleSubcribe}>
                      {profile?.isSubscribed ? (
                        <p>Subscribed</p>
                      ) : (
                        <p>Subscribe</p>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/")}>Login</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <ul className="scroll border-b-2 sticky z-[2] flex flex-row gap-x-4 overflow-auto py-2">
        <li className="w-full">
          <NavLink
            to={""}
            end
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-black bg-black text-white px-2 py-1"
                : "w-full border-black bg-white text-black px-2 py-1"
            }
          >
            <button className="w-full">Videos</button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to={"playlist"}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-black bg-black text-white px-2 py-1"
                : "w-full border-black bg-white text-black px-2 py-1"
            }
          >
            <button className="w-full">PlayList</button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to={"tweets"}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-black bg-black text-white px-2 py-1"
                : "w-full border-black bg-white text-black px-2 py-1"
            }
          >
            <button className="w-full">Tweets</button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to={"about"}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-black bg-black text-white px-2 py-1"
                : "w-full border-black bg-white text-black px-2 py-1"
            }
          >
            <button className="w-full">About</button>
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default MyChannel;
