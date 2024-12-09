import React, { forwardRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { put } from "@vercel/blob";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

const VideoForm = forwardRef(({ onSubmit, ref }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handldeSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const videoFile = formData.get("videoFile");
    const thumbFile = formData.get("thumbnail");

    try {
      const videoBlob = await put(videoFile.name, videoFile, {
        access: "public",
        multipart: true,
      });
      formData.set("videoUrl", videoBlob.url);

      const thumbnailBlob = await put(thumbFile.name, thumbFile, {
        access: "public",
        multipart: true,
      });
      formData.set("thumbnailUrl", thumbnailBlob.url);

      onSubmit(formData);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <form ref={ref} onSubmit={handldeSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
        </div>
        <div>
          <Label htmlFor="description">Video File</Label>
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
          <Label htmlFor="description">Thumbnail File</Label>
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
        <Button type="submit" disabled={isUploading} className="flex justify-center items-center gap-2 bg-gray-800 text-white px-2 py-3 rounded-md hover:bg-gray-900 transition-all">
        <PlusIcon className="w-5 h-5" /> <span>{isUploading ? "Uploading..." : "Upload Video"} </span>
        </Button>
      </form>
    </div>
  );
});

export default VideoForm;
