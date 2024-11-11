import {
  History,
  Home,
  LogOut,
  LucideSubscript,
  MessageCircle,
  Play,
  Settings,
  Sidebar,
  Subscript,
  SubscriptIcon,
  ThumbsUp,
  VideoIcon,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "@/common";
import { toast } from "react-toastify";
import { removeUserDetails } from "@/features/authSlice";

const SideBarNav = () => {
  const [show, setShow] = useState(true);

  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(authStatus);

  const toggleShow = () => {
    setShow(!show);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(fetchApi.logoutUser.url, {
        method: fetchApi.logoutUser.method,
        credentials: "include",
      });

      const dataRes = await response.json();
      if (dataRes.success) {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        toast.success("Logged out!");
        dispatch(removeUserDetails(null));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div className="absolute top-[29px] left-1">
        <div className="text-left">
          <button
            className="text-white"
            type="button"
            aria-controls="drawer-navigation"
            aria-expanded={show}
            onClick={toggleShow}
          >
            <Sidebar />
          </button>
        </div>
        <div
          id="drawer-navigation"
          className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 transition-transform ${
            show ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!show}
        >
          <h5
            id="drawer-navigation-label"
            className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
          >
            <Link to={"/"} className="inline-block">
              <Logo className={""} width={110} height={110} />
            </Link>
          </h5>
          <button
            type="button"
            aria-controls="drawer-navigation"
            onClick={toggleShow}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <X />
            <span className="sr-only">Close menu</span>
          </button>
          <div className="py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Home />
                  <span className="ms-3">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <MessageCircle />
                  <span className="flex-1 ms-3 whitespace-nowrap">Tweets</span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <ThumbsUp />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Liked Videos
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <History />
                  <span className="flex-1 ms-3 whitespace-nowrap">History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Play />
                  <span className="flex-1 ms-3 whitespace-nowrap">Videos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <VideoIcon />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Subscription
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {authStatus && (
            <div className="absolute bottom-0 py-4">
              <ul className="space-y-2 font-medium w-full">
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <LogOut />
                    <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                  </button>
                </li>
                <li>
                  <Link
                    to={"/settings"}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Settings />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Setting
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBarNav;
