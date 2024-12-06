import { EyeIcon, PlusIcon } from "lucide-react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const DashboardStats = ({stats}) => {
  const user = useSelector((state) => state?.auth?.user);
  const uploadRef = useRef()

  return (
    <div>
      <div className="w-full flex px-5 py-5 justify-between">
        <div className="block">
          <h2 className="font-semibold text-xl">
            Welcome Back, {user?.firstName} {user?.lastName}
          </h2>
          <span className="text-sm text-gray-600">Manage Your Channel</span>
        </div>
        <div className="block">
          <button onClick={uploadRef.current?.open()} className="flex justify-center items-center gap-2 bg-gray-800 text-white px-2 py-3 rounded-md hover:bg-gray-900 transition-all">
            <PlusIcon className="w-5 h-5"/>
            Upload Video
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4">
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
            <div className="inline-block">
                <EyeIcon />
            </div>
            <div className="flex justify-between items-center">
                <p className="inline-block">
                    Total Views
                </p>
                <p className="inline-block">
                    {stats?.totalViews}
                </p>
            </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
            <div className="inline-block">
                <EyeIcon />
            </div>
            <div className="flex justify-between items-center">
                <p className="inline-block">
                    Total Videos
                </p>
                <p className="inline-block">
                    {stats?.totalVideos}
                </p>
            </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
            <div className="inline-block">
                <EyeIcon />
            </div>
            <div className="flex justify-between items-center">
                <p className="inline-block">
                    Total Likes
                </p>
                <p className="inline-block">
                    {stats?.totalViews}
                </p>
            </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
            <div className="inline-block">
                <EyeIcon />
            </div>
            <div className="flex justify-between items-center">
                <p className="inline-block">
                    Total Subsccribers
                </p>
                <p className="inline-block">
                    {stats?.totalViews}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
