import fetchApi from "@/common";
import formatDate from "@/helpers/formatDate";
import formatDuration from "@/helpers/formatDuration";
import getTimeDistance from "@/helpers/getTimeDistance";
import {
  EllipsisVertical,
  PencilIcon,
  ThumbsUp,
  TrashIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import axiosFetch from "@/helpers/fetchData";

const Comment = ({ video }) => {
  const [comments, setComments] = useState([]);
  const { videoId } = useParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(window.innerWidth > 1023);
  const [data, setData] = useState({
    content: "",
  });
  const [activeCommentId, setActiveCommentId] = useState(null);

  const handleChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCommentShow = (e) => {
    setShowComments((prev) => !prev);
  };

  const handleShowOptions = (commentId) => {
    setActiveCommentId((prev) => (prev === commentId ? null : commentId));
  };

  useEffect(() => {
    if (activeCommentId) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [activeCommentId]);

  const videoComments = async () => {
    const response = await fetch(
      `${fetchApi.commentsOnVideo.url}/getcomments/${videoId}`,
      {
        method: fetchApi.commentsOnVideo.method,
        credentials: "include",
      }
    );

    const resData = await response.json();
    if (resData?.data.length === 10) {
      setComments((prev) => [...prev, ...resData?.data]);
    } else {
      setComments((prev) => [...prev, ...resData?.data]);
      setHasMore(false);
    }
  };

  const handleLike = async(commentId) => {
    try {
      const res = await axiosFetch.post(`/like/toggle/c/${commentId}`);

      if(res.data.success){
        setComments((prev) => (
          prev.map((comment) => comment?._id === commentId ? {
            ...comment,
            isLiked: !comment?.isLiked,
            likesCount: comment?.isLiked
            ? comment?.likesCount - 1 :
            comment?.likesCount + 1
          }: comment)
        ))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (page === 1) {
      setComments([]);
    }

    videoComments();
  }, [videoId, page]);

  const addComments = async (e) => {
    e.preventDefault();
    if (!status) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${fetchApi.commentsOnVideo.url}/a/${video?.[0]?._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const resData = await response.json();

      if (response.ok && resData?.data) {
        setComments((prev) => [resData.data, ...prev]);
        setData({ content: "" });
      } else {
        console.error(
          "Error adding comment:",
          resData?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Comment submission error:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowComments(window.innerWidth > 1023);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(comments)
  return (
    <div>
      <div className="mt-4">
        <h1 className="font-bold text-2xl">Comments ({comments.length})</h1>
      </div>
      <div className="mt-3 flex items-center gap-x-2 sm:gap-x-4">
        <p>
          <img
            src={video?.[0]?.owner?.avatar}
            className="w-6 h-6 sm:w-10 sm:h-10"
            alt="avatar_image"
          />
        </p>
        <form
          className="w-full flex items-center gap-x-2"
          onSubmit={addComments}
        >
          <Input
            placeholder="Add Comments"
            className="min-h-[90%]"
            name="content"
            value={data.content}
            onChange={handleChange}
            onFocus={() => {
              if (!status) {
                navigate("/login");
              }
            }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>

      {window.innerWidth <= 1023 && (
        <div className="flex justify-center py-2">
          <button onClick={handleCommentShow}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
        </div>
      )}

      {showComments && (
        <div className="mt-3">
          <div className="">
            {comments.map((comment) => (
              <div key={comment?._id}>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center w-[90%]">
                    <Link
                      to={`/channel/${video?.[0]?.owner?.userName}`}
                      className="px-1"
                    >
                      <img
                        src={comment?.owner.avatar}
                        alt="avatar_image"
                        className="w-7 h-7"
                      />
                    </Link>
                    <div className="flex gap-x-1">
                      <Link
                        to={`/channel/${video?.[0]?.owner?.userName}`}
                        className="-mb-2 inline-block text-white px-2"
                      >
                        <span className="bg-[#222222e0] inline-block">
                          @{comment?.owner?.userName}
                        </span>
                      </Link>
                      <p>{getTimeDistance(comment?.createdAt)}</p>
                    </div>
                  </div>
                  {status ||
                    (user?._id && (
                      <div className="relative">
                        <button onClick={() => handleShowOptions(comment?._id)}>
                          <EllipsisVertical />
                        </button>
                        {activeCommentId === comment?._id && (
                          <div
                            className={`absolute right-0 mt-2 bg-[white] rounded-lg shadow-2xl z-10 border`}
                          >
                            <button className="w-full px-4 py-2 flex items-center gap-2">
                              <PencilIcon />
                              <span>Edit</span>
                            </button>
                            <button className="w-full px-4 py-2 flex items-center gap-2">
                              <TrashIcon />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="px-10 -mt-2">
                  <p>{comment?.content}</p>
                  <button className="py-2 mb-3 flex items-center gap-2" onClick={() => handleLike(comment?._id)}>
                    <ThumbsUp fill={comment?.isLiked ? "#121" : "none"} />
                    <span>
                      {comment?.likesCount > 0 ? comment?.likesCount : "Like"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
