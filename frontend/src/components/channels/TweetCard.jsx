import React from "react";
import userPng from "@/assets/user.png";
import getTimeDistance from "@/helpers/getTimeDistance";
import { Button } from "../ui/button";
import axiosFetch from "@/helpers/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { LucideKey, MoreVertical, ThumbsUp } from "lucide-react";
import { toggleLikeTweet } from "@/features/userTweets";
import { useNavigate } from "react-router-dom";

const TweetCard = ({ tweet }) => {
  const status = useSelector((state) => state?.auth?.status);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const toggleLike = async () => {
    try {
      if (status) {
        const response = await axiosFetch.post(`/like/toggle/t/${tweet?._id}`);

        if (response?.data?.data) {
          console.log(response?.data);
          dispatch(
            toggleLikeTweet({
              tweetId: tweet?._id,
              isLiked: !tweet?.isLiked,
              likesCount: tweet?.isLiked
                ? tweet?.likesCount - 1
                : tweet?.likesCount + 1,
            })
          );
        }
      } else {
        navigation("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <div className="flex gap-4 border-b shadow-sm border-gray-300 mb-3 py-2 px-3">
        <img
          src={tweet?.userDetails?.avatar || userPng}
          className="w-10 h-10 bg-cover"
        />
        <div className="w-full flex flex-col items-center mb-2 group">
          <div className="w-full flex justify-between">
            <div>
              <div className="flex items-center gap-x-2">
                <p className="text-lg font-semibold">
                  {tweet?.userDetails?.firstName} {tweet?.userDetails?.lastName}
                </p>
                {"•"}
                <p className="text-sm">{getTimeDistance(tweet?.createdAt)}</p>
              </div>
              <p className="text-gray-600 -my-1">
                @{tweet?.userDetails?.userName}
              </p>
              <div>
                <p>{tweet?.content}</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={toggleLike}>
                  {tweet?.isLiked ? (
                    <ThumbsUp fill="#000" fontSize={15} />
                  ) : (
                    <ThumbsUp fontSize={15} />
                  )}
                </button>
                <p>{tweet?.likesCount}</p>
              </div>
            </div>
            {status && (
              <div className="hidden group-hover:block transition-all cursor-pointer">
                <MoreVertical />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
