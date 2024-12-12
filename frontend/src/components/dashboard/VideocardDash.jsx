import fetchApi from "@/common";
import {
  deleteVideo,
  updateVideoPublishStatus,
} from "@/features/dashboardSlice";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Switch } from "../ui/switch";
import { Link } from "react-router-dom";
import formatDate from "@/helpers/formatDate";
import { Edit, ListFilter, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const VideocardDash = ({ video }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [publish, setPublish] = useState(video?.isPublished);

  const handleTogglePublish = async () => {
    try {
      const response = await fetch(
        `${fetchApi.getAllVideos.url}/${video?._id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (resData?.data) {
        dispatch(
          updateVideoPublishStatus({
            videoId: video._id,
            isPublished: !video.isPublished,
          })
        );
        toast.success("Video Published");
        setPublish((pre) => !pre);
      }
    } catch (error) {
      toast.error("error while publishing videos");
      console.log(error);
    }
  };

  const handleDeleteVideo = async () => {
    // if (isConfirm) {
    try {
      const response = await fetch(
        `${fetchApi.getAllVideos.url}/${video._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (resData.data) {
        dispatch(deleteVideo(video._id));
        toast.success("Video deleted");
        getCH;
      }
    } catch (error) {
      toast.error("video can't be deleted");
      console.log(error);
    }
    // }
  };
  return (
    <>
      <tr
        key={video?._id}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      >
        <td className="p-4 text-center">
          <Label className="" htmlFor={"vid" + video?._id}></Label>
          <Switch
            id={"vid" + video?._id}
            onCheckedChange={handleTogglePublish}
            checked={video?.isPublished}
          />
        </td>
        <td
          className={`p-4 text-center font-bold ${
            publish ? "text-green-600" : "text-red-600"
          }`}
        >
          {publish ? "Published" : "Unpublished"}
        </td>
        <td className="p-4 text-center">
          {publish ? (
            <Link to={`/video/${video?.title}/${video?._id}`}>
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className="w-14 h-8 mx-auto"
              />
            </Link>
          ) : video?.title?.length > 35 ? (
            video?.title.substr(0, 35) + "..."
          ) : (
            video?.title
          )}
        </td>
        <td className="p-4 text-center font-bold">
          {formatDate(video?.createdAt)}
        </td>
        <td className="p-4 text-center font-bold">
            <div className="relative">
                {video?.views}
            </div>
            <div>

            </div>
        </td>
        <td className="p-4 text-center font-bold">{video?.commentsCount}</td>
        <td className="p-4 text-center font-bold">{video?.likesCount}</td>
        <td className="p-4 text-center font-bold">
          <div className="flex gap-2 justify-center">
            <Dialog>
              <DialogTrigger>
                <Trash className="w-6 h-6 text-red-600"/>
              </DialogTrigger>
              <DialogContent
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    <p className="font-semibold py-3">
                      Are you sure you want to delete this video? Once deleted,
                      you will not be able to recover it.
                    </p>
                    <div className="block me-auto text-end">
                      <Button onClick={handleDeleteVideo}>Delete</Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div className="">
              <Edit className="w-6 h-6 text-orange-400"/>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default VideocardDash;
