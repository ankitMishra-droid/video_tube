import {
  History,
  Home,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  MessageCircle,
  Play,
  Settings,
  Sidebar,
  ThumbsUp,
  VideoIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "@/common";
import { toast } from "react-toastify";
import { removeUserDetails } from "@/features/authSlice";
import axiosFetch from "@/helpers/fetchData";

const SideBarNav = ({ setIsSidebarIsOpen, textColor }) => {
  const [show, setShow] = useState(false);

  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleShow = () => {
    setShow(!show);
    setIsSidebarIsOpen(!show);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosFetch.get("/users/logout");

      if (response.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        toast.success("Logged out!");
        dispatch(removeUserDetails(null));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setShow(false);
    } else if (location.pathname === "/" && window.innerWidth < 767) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [location.pathname]);

  // Function to check if the current path matches the link path
  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {location.pathname !== "/" && show && (
        <div
          className={`fixed inset-0 sm:bg-gray-950/30 sm:bg-opacity-50 z-30`}
          onClick={toggleShow}
        ></div>
      )}
      <div className="absolute top-[29px] left-1 z-50">
        <div className="text-left">
          <button
            className={`${textColor}`}
            type="button"
            aria-controls="drawer-navigation"
            aria-expanded={show}
            onClick={toggleShow}
          >
            <MenuIcon />
          </button>
        </div>
        <div
          id="drawer-navigation"
          className={`fixed top-0 w-full left-0 z-40 sm:w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 transition-transform ${
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
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    isActiveLink("/")
                      ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <Home />
                  <span className="ms-3">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tweets"
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    isActiveLink("/tweets")
                      ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <MessageCircle />
                  <span className="flex-1 ms-3 whitespace-nowrap">Tweets</span>
                </Link>
              </li>
              <li>
                <Link
                  to="liked-videos"
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    isActiveLink("/liked-videos")
                      ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <ThumbsUp />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Liked Videos
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="history"
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    isActiveLink("/history")
                      ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <History />
                  <span className="flex-1 ms-3 whitespace-nowrap">History</span>
                </Link>
              </li>
              <li>
                {authStatus && (
                  <Link
                    to={`/admin/dashboard`}
                    className={`flex items-center p-2 rounded-lg dark:text-white group ${
                      isActiveLink("/admin/dashboard")
                        ? "bg-gray-600 text-white"
                        : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    <LayoutDashboard />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Dashboard
                    </span>
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="subscriptions"
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    isActiveLink("/subscriptions")
                      ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
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
            <div className="absolute bottom-0 py-4 w-full left-0 right-0 overflow-hidden">
              <ul className="space-y-2 font-medium w-full">
                <li>
                  <Link
                    onClick={handleLogout}
                    className="flex items-center py-2 px-2 mx-5 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                  >
                    <LogOut />
                    <span className="ms-3 whitespace-nowrap">Logout</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/settings"}
                    className={`flex items-center py-2 px-2 mx-5 text-gray-900 rounded-lg dark:hover:bg-gray-700 group ${isActiveLink("/settings") ? "bg-gray-600 text-white"
                      : "text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600" }`}
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
