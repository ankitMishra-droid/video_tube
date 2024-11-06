import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { LucideSunDim, MoonIcon } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

        {authStatus && userData && (
          <>
            <Link to={`/channel/${userData.userName}`}>
              <img
                src={userData.avatar}
                alt={userData.userName}
                className="object-cover h-14 w-14 shrink-0 rounded-full"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
