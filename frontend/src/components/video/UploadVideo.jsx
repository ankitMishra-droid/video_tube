import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import loadingIcon from "@/assets/loader.gif";
import { Video } from "lucide-react";

const UploadVideoModal = ({ isOpen, onClose, updating, video }) => {
  const videoSize = video?.videoFile
    ? (video.videoFile.size / 1000000).toFixed(2)
    : 0;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {updating ? "Updating" : "Uploading"} Video...
          </DialogTitle>
          <DialogDescription>
            Video {updating ? "updating" : "uploading"} is in progress. Please
            do not close.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-x-2">
          <h6 className="flex items-center gap-2">
            <Video />
            {updating
              ? `Updating ${video?.title}`
              : `Uploading ${video?.title}`}
          </h6>

          <p className="text-sm ms-4">
            {videoSize > 0 ? `${videoSize} MB` : "No file selected"}
          </p>

          <div className="mt-2 flex gap-3">
            <img src={loadingIcon} className="w-10 h-10" alt="loadingImg" />
            {updating ? "Updating" : "Uploading"}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          {!updating && (
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="flex justify-center items-center gap-2 bg-gray-800 text-white px-2 py-3 rounded-md hover:bg-gray-900 transition-all">
                Cancel
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoModal;
