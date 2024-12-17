import fetchApi from "@/common";
import { setVideo } from "@/features/videoSlice";
import getTimeDistance from "@/helpers/getTimeDistance";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Ellipsis, EllipsisVertical, ThumbsUp } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const VideoInfo = ({ video }) => {
  const timeDistance = getTimeDistance(video?.[0].createdAt);
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const selectLink = useRef(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const { videoId } = useParams();

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  function copyToClipboard(e) {
    navigator.clipboard.writeText(selectLink.current.value);

    e.target.focus();
    toast.success("Copied!", {
      position: "top-center",
    });
  }

  const toggleLike = async (e) => {
    if (!status) {
      navigate("/login");
      return;
    } else {
      try {
        const response = await fetch(
          `${fetchApi.toggleLike.url}/toggle/v/${videoId}`,
          {
            method: fetchApi.toggleLike.method,
            credentials: "include",
          }
        );

        const resData = await response.json();
        console.log(resData?.data);
        if (resData.data) {
          dispatch(
            setVideo({
              ...video,
              isLiked: !video.isLiked,
              likeCount: video.isLiked
                ? video.likeCount - 1
                : video.likeCount + 1,
            })
          );
        }
      } catch (error) {
        toast.error("something went wrong");
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mt-3">
            <h2 className="capitalize font-bold text-xl md:text-2xl line-clamp-3">
              {video?.[0].title}
            </h2>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <EllipsisVertical className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input
                        ref={selectLink}
                        id="link"
                        defaultValue={window.location.href}
                        readOnly
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="px-3"
                      onClick={copyToClipboard}
                    >
                      <span className="sr-only">Copy</span>
                      <Copy />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 gap-2">
            <div className="flex gap-2 sm:gap-3 items-center">
              <Link
                to={`/channel/${video?.[0]?.owner?.userName}`}
                className="inline-block"
              >
                <img
                  src={video?.[0]?.owner?.avatar}
                  className="w-5 h-5 sm:w-10 sm:h-10 my-2"
                />
              </Link>
              <div>
                <p className="text-base sm:text-lg font-medium sm:font-semibold -mb-1 sm:-mb-2">
                  {video?.[0]?.owner?.firstName} {video?.[0]?.owner?.lastName}
                </p>
                <Link
                  to={`/channel/${video?.[0]?.owner?.userName}`}
                  className="text-sm"
                >
                  @{video?.[0]?.owner?.userName}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <button
                  className="bg-[#212121] hover:bg-[#111] text-white rounded-lg transition-all px-3 py-2"
                  onClick={toggleLike}
                >
                  <div className="flex items-center justify-center gap-2">
                    {video?.[0]?.isLiked ? (
                      <>
                        <ThumbsUp fill="white" />
                        <p>
                          {video?.[0]?.likeCount > 0
                            ? video?.[0]?.likeCount
                            : "Like"}
                        </p>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 sm:w-full sm:h-full"/>
                        <p>
                          {video?.[0]?.likeCount > 0
                            ? video?.[0]?.likeCount
                            : "Like"}
                        </p>
                      </>
                    )}
                  </div>
                </button>
              </div>
              <div>
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <h4 className="font-semibold mt-3 -mb-6 text-base">
            {video?.[0].views} views {" • "} {timeDistance}
          </h4>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <p
            className={`font-semibold my-1 text-base ${
              showFullDescription ? "" : "line-clamp-1"
            }`}
          >
            {video?.[0].description ? video?.[0].description : "No description"}
          </p>
          <button onClick={toggleDescription}>
            {showFullDescription && <Ellipsis />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
