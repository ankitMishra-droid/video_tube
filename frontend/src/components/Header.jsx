import React, { useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { LucideSunDim, MoonIcon, User2 } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector } from "react-redux";
import Layout from "@/app/layout";

const Header = () => {
  const authStatus = useSelector((state) => state?.auth?.status);
  const { user } = useSelector((state) => state?.auth);

  const [showSideBar, setShowSideBar] = useState(false)
  
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="h-screen w-full bg-gray-700 py-6">
      <div className="container mx-auto flex items-center align-middle justify-between md:gap-0 gap-2">
        <Layout />
        <Link to={"/"} className="inline-block">
          <Logo className={""} width={110} height={110} />
        </Link>
        <Search />
        {!authStatus && (
          <>
            <Button>
              <Link to={"/login"}>Login</Link>
            </Button>
          </>
        )}

        {authStatus && user && (
          <div>
            <Link to={`/channel/${user.userName}`} className="flex">
              {/* <img
                src={user.avatar}
                alt={user.firstName}
                className="object-cover h-14 w-14 shrink-0 rounded-full"
              /> */}
              <p className="text-white">
                <User2 />
              </p>
              <p className="text-white">{user.firstName}</p>
            </Link>
          </div>
        )}
        {/* <button onClick={toggleMode}>
          {theme === "dark" ? <LucideSunDim /> : <MoonIcon />}
        </button> */}
      </div>
    </nav>
  );
};

export default Header;
