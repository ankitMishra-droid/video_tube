import React, { forwardRef, useState, useEffect } from "react";
// import { Label, Input, Textarea, Button, Switch } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import UploadVideoModal from "@/components/video/UploadVideo";
import { useDispatch } from "react-redux";
import { addVideoStats } from "@/features/dashboardSlice";
import { getChannelVideos } from "@/fetchDetails/getDashBoard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import fetchApi from "@/common";

const VideoForm = forwardRef(({ closeModal, video = false}, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
    isPublished: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "video") {
      setVideoPreview(URL.createObjectURL(file));
      setData((prev) => ({ ...prev, videoFile: file }));
    } else if (type === "thumbnail") {
      setThumbnailPreview(URL.createObjectURL(file));
      setData((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile);
    formData.append("thumbnail", data.thumbnail);
    formData.append("isPublished", data.isPublished);

    setIsUploading(true);
    setModalOpen(true);

    try {
      const response = await axios.post(fetchApi.getAllVideos.url, formData, {
        withCredentials: true,
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          console.log(`Progress: ${progress}%`);
        },
      });

      if (response.data) {
        toast.success("Video uploaded successfully!");
        dispatch(addVideoStats(response.data));
        closeModal();
        getChannelVideos(dispatch);
        setData({
          title: "",
          description: "",
          videoFile: null,
          thumbnail: null,
          isPublished: true,
        });
        setVideoPreview(null);
        setThumbnailPreview(null);
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Upload failed!");
    } finally {
      setIsUploading(false);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={data.title} onChange={handleChange} required />
        </div>
        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={data.description} onChange={handleChange} required />
        </div>
        {/* Video File */}
        <div>
          <Label htmlFor="videoFile">Video File</Label>
          <Input id="videoFile" type="file" accept="video/*" onChange={(e) => handleFileChange(e, "video")} required />
          {videoPreview && <video src={videoPreview} controls className="mt-2 max-w-full h-auto" />}
        </div>
        {/* Thumbnail */}
        <div>
          <Label htmlFor="thumbnail">Thumbnail File</Label>
          <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "thumbnail")} required />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-2 max-w-full h-auto" />}
        </div>
        {/* Publish Toggle */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="isPublish">Publish</Label>
          <Switch id="isPublish" checked={data.isPublished} onCheckedChange={(val) => setData((prev) => ({ ...prev, isPublished: val }))} />
        </div>
        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isUploading} className="flex justify-center items-center gap-2 bg-gray-800 text-white px-2 py-3 rounded-md hover:bg-gray-900 transition-all">
            <PlusIcon className="w-5 h-5" />
            <span>{isUploading ? "Uploading..." : "Upload Video"}</span>
          </Button>
        </div>
      </form>

      {/* Modal */}
      <UploadVideoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
});

export default VideoForm;
