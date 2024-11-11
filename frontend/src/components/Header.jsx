import React, { useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { LucideSunDim, MoonIcon, User2 } from "lucide-react";
import Logo from "./Logo";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import fetchApi from "@/common";
import { removeUserDetails } from "@/features/authSlice";

const Header = () => {
  const authStatus = useSelector((state) => state?.auth?.status);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch()
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate()

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async() => {
    try {
      const response = await fetch(fetchApi.logoutUser.url, {
        method: fetchApi.logoutUser.method,
        credentials: "include"
      });

      const dataRes = await response.json();
      if(dataRes.success){
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        toast.success("Logged out!")
        dispatch(removeUserDetails(null))
        navigate("/")
    }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <nav className="w-full bg-gray-700 py-6">
      <div className="container mx-auto flex items-center align-middle justify-between md:gap-0 gap-2">
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
          <div className="flex gap-3 items-center">
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
            <button onClick={handleLogout} className="rounded-sm bg-white/90 px-3 py-1">Logout</button>
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
