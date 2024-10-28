import {
  ListCollapse,
  SearchIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";

const Header = () => {
  const [menuBar, setMenuBar] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  return (
    <header className="h-16 fixed w-full bg-gray-700">
      <div className="container flex justify-evenly items-center py-3">
        <div className="max-w-xs flex gap-2">
          <Button>
            <ListCollapse />
          </Button>
          <Link to={"/"}>
            <Logo width={90} height={90} />
          </Link>
        </div>

        <div className="max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              name="searchText"
              id="searchText"
              placeholder="Search..."
              className="p-2 border rounded-md w-full"
            />
            <div className="p-2 rounded-md bg-black text-white cursor-pointer">
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="max-w-xs">
          {user === false ? (
            <div>
              <Link>
                <Button>Logout</Button>
              </Link>
            </div>
          ) : (
            <div>
              <Link to={"/login"}>
                <Button>Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
