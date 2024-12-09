import { EyeIcon, PlusIcon } from "lucide-react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoForm from "../video/VideoForm";
import fetchApi from "@/common"; // assuming fetchApi is your custom fetch utility

const DashboardStats = ({ stats }) => {
  const user = useSelector((state) => state?.auth?.user);
  const formRef = useRef(null);

  const handleSubmit = async (formData) => {
    try {
      // Send the FormData directly (no need to stringify it)
      const response = await fetch(fetchApi.getAllVideos.url, {
        method: "POST",
        credentials: "include",
        body: formData, // directly send FormData
      });

      const resData = await response.json();
      console.log("Video upload response:", resData);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-y-3 sm-[450]:flex-row md:px-5 py-5 justify-between">
        <div className="block">
          <h2 className="font-semibold text-xl">
            Welcome Back, {user?.firstName} {user?.lastName}
          </h2>
          <span className="text-sm text-gray-600">Manage Your Channel</span>
        </div>
        <div className="block">
          <Dialog className="px-5 md:px-0">
            <DialogTrigger asChild>
              <Button className="flex align-middle">
                <PlusIcon /> Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px] max-h-screen overflow-y-auto"
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Upload Video</DialogTitle>
              </DialogHeader>
              <VideoForm ref={formRef} onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4">
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
          <div className="inline-block">
            <EyeIcon />
          </div>
          <div className="flex justify-between items-center">
            <p className="inline-block">Total Views</p>
            <p className="inline-block">{stats?.totalViews}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
          <div className="inline-block">
            <EyeIcon />
          </div>
          <div className="flex justify-between items-center">
            <p className="inline-block">Total Videos</p>
            <p className="inline-block">{stats?.totalVideos}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
          <div className="inline-block">
            <EyeIcon />
          </div>
          <div className="flex justify-between items-center">
            <p className="inline-block">Total Likes</p>
            <p className="inline-block">{stats?.totalLikes}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 px-2 border border-gray-900 rounded-md py-2">
          <div className="inline-block">
            <EyeIcon />
          </div>
          <div className="flex justify-between items-center">
            <p className="inline-block">Total Subscribers</p>
            <p className="inline-block">{stats?.subscriberCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
