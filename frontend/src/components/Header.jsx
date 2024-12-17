import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { LucideSunDim, MoonIcon, User2 } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector } from "react-redux";

const Header = () => {
  const authStatus = useSelector((state) => state?.auth?.status);
  const user = useSelector((state) => state?.auth?.user);
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full bg-gray-700 py-6">
      <div className="container mx-auto flex items-center align-middle justify-between md:gap-0 gap-2 px-2">
        <Link
          to={"/"}
          className="hidden md:inline-block md:pl-7 pl-0 pr-3 md:pr-0"
        >
          <Logo className={""} width={110} height={110} />
        </Link>
        <div className="pl-9 md:pl-0">
          <Search />
        </div>
        {!authStatus && (
          <>
            <Button>
              <Link to={"/login"}>Login</Link>
            </Button>
          </>
        )}

        {authStatus && user && (
          <div className="flex gap-3 items-center">
            <Link to={`/channel/${user.userName}`} className="flex items-center gap-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="object-cover h-10 w-10 shrink-0 rounded-full"
                />
              ) : (
                <p className="text-white">
                  <User2 />
                </p>
              )}

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
