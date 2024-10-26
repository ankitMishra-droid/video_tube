import { LucideListCollapse, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <div>
      <nav className="px-4 py-3 bg-gray-700 text-white">
        <div className="mx-auto max-w-7xl flex px-2 sm:px-6 lg:px-8">
          <div className="w-1/3">
            <Link to={"/"} className="text-xl text-center mt-auto">VideoTube</Link>
          </div>
          <div className="w-1/3 relative">
            <div className="">
                <input type="text" placeholder="Search" name="search" id="search" className="w-full bg-gray-500 text-white px-5 rounded-full py-2 focus:bg-white focus:text-black focus:outline-none"/>
            </div>
                <div className="absolute top-0 right-0 pr-5 py-2 border-l-[1px] pl-4 cursor-pointer focus:text-black">
                    <Search className="focus:text-black"/>
                </div>
          </div>
          <div className="w-1/3">
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
