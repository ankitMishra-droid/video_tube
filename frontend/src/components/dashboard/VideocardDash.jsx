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
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getChannelVideos } from "@/fetchDetails/getDashBoard";
import axiosFetch from "@/helpers/fetchData";

const VideocardDash = ({ video }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState({
    title: video?.title,
    description: video?.description || "", // default to empty string
  });
  const [publish, setPublish] = useState(video?.isPublished);
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleTogglePublish = async () => {
    try {
      const response = await axiosFetch.put(`/video/${video?._id}`);

      if (response?.data?.data) {
        dispatch(
          updateVideoPublishStatus({
            videoId: video._id,
            isPublished: !video.isPublished,
          })
        );
        toast.success("Video Published");
        getChannelVideos(dispatch, user?._id);
        setPublish((prev) => !prev);
      }
    } catch (error) {
      toast.error("Error while publishing video");
      console.log(error);
    }
  };

  const handleDeleteVideo = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video? Once deleted, you will not be able to recover it."
    );
    if (!confirmed) return;

    try {
      const response = await axiosFetch.delete(`/video/${video._id}`);

      if (response?.data?.data) {
        dispatch(deleteVideo(video._id));
        toast.success("Video deleted");
        getChannelVideos(dispatch, user?._id);
      }
    } catch (error) {
      toast.error("Video can't be deleted");
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosFetch.patch(`/video/${video?._id}`, data);

      if (response?.data) {
        closeModal();
        toast.success(response.data.message || "Video updated successfully!");
        getChannelVideos(dispatch, user?._id);
      } else {
        toast.error(response.data.data.meessage || "Error updating video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Error while updating the video");
    }
  };

  return (
    <>
      <tr key={video?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="p-4 text-center">
          <Label htmlFor={"vid" + video?._id}></Label>
          <Switch
            id={"vid" + video?._id}
            onCheckedChange={handleTogglePublish}
            checked={publish}
          />
        </td>
        <td className={`p-4 text-center font-bold ${publish ? "text-green-600" : "text-red-600"}`}>
          {publish ? "Published" : "Unpublished"}
        </td>
        <td className="p-4 text-center">
          {publish ? (
            <Link to={`/video/${video?.title}/${video?._id}`}>
              <img src={video?.thumbnail} alt={video?.title} className="w-14 h-8 mx-auto" />
            </Link>
          ) : video?.title?.length > 35 ? (
            video?.title.substr(0, 35) + "..."
          ) : (
            video?.title
          )}
        </td>
        <td className="p-4 text-center font-bold">{formatDate(video?.createdAt)}</td>
        <td className="p-4 text-center font-bold">{video?.views}</td>
        <td className="p-4 text-center font-bold">{video?.commentsCount}</td>
        <td className="p-4 text-center font-bold">{video?.likesCount}</td>
        <td className="p-4 text-center font-bold">
          <div className="flex gap-2 justify-center">
            {/* Delete Video Dialog */}
            <Dialog>
              <DialogTrigger>
                <Trash className="w-6 h-6 text-red-600 cursor-pointer" />
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    <p className="font-semibold py-3">
                      Are you sure you want to delete this video? Once deleted, you will not be able to recover it.
                    </p>
                    <div className="block me-auto text-end">
                      <Button onClick={handleDeleteVideo}>Delete</Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Edit Video Dialog */}
            <Dialog open={modal} onOpenChange={setModal}>
              <DialogTrigger asChild>
                <Edit className="w-6 h-6 text-orange-400 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto px-2" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Update Video</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={data.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Button type="submit">Update Video</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </td>
      </tr>
    </>
  );
};

export default VideocardDash;
