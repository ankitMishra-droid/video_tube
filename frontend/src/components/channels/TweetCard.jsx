import React, { useState, useEffect, useRef } from "react";
import userPng from "@/assets/user.png";
import getTimeDistance from "@/helpers/getTimeDistance";
import axiosFetch from "@/helpers/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { Edit, MoreVertical, ThumbsUp, Trash } from "lucide-react";
import { deleteTweets, toggleLikeTweet } from "@/features/userTweets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TweetCard = ({ tweet }) => {
  const status = useSelector((state) => state?.auth?.status);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigation = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLike = async () => {
    try {
      if (status) {
        const response = await axiosFetch.post(`/like/toggle/t/${tweet?._id}`);

        if (response?.data?.data) {
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

  const deleteTweet = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosFetch.delete(`/tweet/${tweet?._id}`);

      if (response?.data?.data && status) {
        dispatch(deleteTweets(tweet?._id));
        toast.success(response?.data?.data?.message || "Tweet deleted");
      } else {
        toast.error(response?.data?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosFetch.post(`/tweet/${tweet?._id}`)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 border-b shadow-sm border-gray-300 mb-3 py-2 px-3 relative">
        <img
          src={tweet?.userDetails?.avatar || userPng}
          className="w-10 h-10 bg-cover"
        />
        <div className="w-full flex flex-col items-center mb-2">
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
              <div className="relative">
                <MoreVertical
                  className="cursor-pointer"
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-0 mt-2 w-28 bg-white shadow-lg rounded-md"
                  >
                    <div
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                      onClick={handleUpdate}
                    >
                      <Edit fontSize={16} /> <span>Edit</span>
                    </div>
                    <div
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-red-600"
                      onClick={deleteTweet}
                    >
                      <Trash fontSize={16} /> <span>Delete</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
