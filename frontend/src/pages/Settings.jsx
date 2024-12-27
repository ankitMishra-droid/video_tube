import React, { useState } from "react";
import logoImg from "@/assets/logo.png";
import userImg from "@/assets/user.png";

import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PersonalInfo from "@/components/settings/PersonalInfo";
import ChannelDetail from "@/components/settings/ChannelDetail";
import ChangePassword from "@/components/settings/ChangePassword";

const Settings = () => {
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const toggleTab = (index) => {
    setCurrentTab(index);
  };

  return (
    <div>
      <div className="w-full h-32 sm:h-36 border-b mb-3 shadow-lg flex items-center">
        <img src={logoImg} className="m-auto" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          <div className="border rounded-full border-gray-500 p-1">
            <img
              src={userData?.avatar ? userData?.avatar : userImg}
              className="mx-auto w-10 h-10"
            />
          </div>
          <div>
            <p className="mx-3 text-lg font-semibold">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="mx-3 -mt-2 text-gray-600">@{userData?.userName}</p>
          </div>
        </div>
        <div>
          <Button onClick={() => navigate(`/channel/${userData?.userName}`)}>
            View Channel
          </Button>
        </div>
      </div>
      <div>
        <ul className="w-full flex flex-row gap-x-2 mt-6 mb-3 overflow-auto py-1 border-b-2 border-gray-600">
          {["Personal Info", "Channel Info", "Change Password"].map(
            (tab, index) => (
              <li key={index} className="w-full md:w-1/3 mx-auto">
                <Link
                  onClick={() => toggleTab(index)}
                  className={`w-full block text-center py-2 rounded-lg transition-all duration-300 text-nowrap px-3 sm:px-0 ${
                    currentTab === index
                      ? "bg-gray-800 text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </Link>
              </li>
            )
          )}
        </ul>
        {currentTab === 0 && <PersonalInfo />}
        {currentTab === 1 && <ChannelDetail />}
        {currentTab === 2 && <ChangePassword />}
      </div>
    </div>
  );
};

export default Settings;
