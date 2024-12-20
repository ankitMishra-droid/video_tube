import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { User2 } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector } from "react-redux";
import SideBarNav from "./SideBarNav";

const Header = ({ setIsSidebarIsOpen }) => {
  const authStatus = useSelector((state) => state?.auth?.status);
  const user = useSelector((state) => state?.auth?.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bgColor, setBgColor] = useState("bg-transparent");
  const [textColor, setTextColor] = useState("text-black");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
        setBgColor("bg-gray-800");
        setTextColor("text-white");
      } else {
        setIsScrolled(false);
        setBgColor("bg-white");
        setTextColor("text-black");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full py-6 fixed top-0 left-0 right-0 z-50 transition-all shadow-md ${bgColor}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Sidebar and Logo */}
        <SideBarNav
          setIsSidebarIsOpen={setIsSidebarIsOpen}
          textColor={textColor}
        />
        <Link
          to="/"
          className="hidden md:inline-block md:pl-7 pl-0 pr-3 md:pr-0"
        >
          <Logo className="" width={110} height={110} />
        </Link>

        {/* Search Component */}
        <div className="pl-9 md:pl-0 flex-grow max-w-md">
          <Search textColor={textColor} />
        </div>

        {/* User Info and Login Button */}
        {!authStatus ? (
          <div>
            <Link to="/login" className={textColor}>
              Login
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link
              to={`/channel/${user.userName}`}
              className={`flex flex-col sm:flex-row items-center sm:gap-2 ${textColor}`}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="object-cover w-7 h-7 sm:w-10 sm:h-10 rounded-full object-fit"
                />
              ) : (
                <User2 className="text-white w-7 h-7 sm:w-10 sm:h-10 object-fit" />
              )}
              <p className={`hidden sm:block ${textColor}`}>{user.firstName}</p>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
