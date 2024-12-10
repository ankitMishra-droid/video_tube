import React, { forwardRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { PlusIcon } from "lucide-react";
import fetchApi from "@/common";
import { toast } from "react-toastify";
import UploadVideoModal from "@/components/video/UploadVideo";
import { useDispatch } from "react-redux";
import { addVideoStats } from "@/features/dashboardSlice";

const VideoForm = forwardRef(({ video = false, closeModal }, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
    isPublished: true
  });

  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      videoFile: videoFile,
    }));

    const videoUrl = URL.createObjectURL(videoFile);
    setVideoPreview(videoUrl);
  };

  const togglePublish = (checked) => {
    setData((prevData) => ({
      ...prevData,
      isPublished : checked
    }))
  }

  const handleThumbnailChange = (e) => {
    const thumbnail = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      thumbnail: thumbnail,
    }));

    const thumbnailUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreview(thumbnailUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile);
    formData.append("thumbnail", data.thumbnail);
    formData.append("isPublished", data.isPublished)

    if (!data.videoFile) {
      console.error("No video file found!");
      return;
    }

    setIsUploading(true);
    setModalOpen(true);

    try {
      const response = await fetch(`${fetchApi.getAllVideos.url}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading media.");
      }

      const result = await response.json();
      if (result.data) {
        toast.success("Video uploaded");
        dispatch(addVideoStats(result.data));
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="videoFile">Video File</Label>
          <Input
            id="videoFile"
            name="videoFile"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mt-2 max-w-full h-auto"
            />
          )}
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail File</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mt-2 max-w-full h-auto"
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="isPublish">Publish</Label>
          <Switch id="isPublish" name="isPublish" checked={data.isPublished} onCheckedChange={togglePublish}/>
        </div>
          {/* <span className="text-xs">Note.*By default the video is published</span> */}
        <div>
          <Button
            type="submit"
            disabled={isUploading}
            className="flex justify-center items-center gap-2 bg-gray-800 text-white px-2 py-3 rounded-md hover:bg-gray-900 transition-all"
          >
            <PlusIcon className="w-5 h-5" />{" "}
            <span>{isUploading ? "Uploading..." : "Upload Video"}</span>
          </Button>
        </div>
      </form>

      {/* Uploading Modal */}
      <UploadVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        updating={false}
        video={data}
      />
    </div>
  );
});

export default VideoForm;