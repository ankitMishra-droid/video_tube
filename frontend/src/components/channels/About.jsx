import fetchApi from "@/common";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import loader from "@/assets/loader.gif";
import { Eye, GlobeIcon, InfoIcon, LucideSubscript, Mail, MessageCircle, SubscriptIcon, ThumbsUp, Video } from "lucide-react";

const About = () => {
  const { userName } = useParams();
  const user = useSelector((state) => state?.user?.user);
  const [loading, setLoading] = useState(true);
  const [aboutChannel, setAboutChannel] = useState(null);

  const getAboutDetails = async () => {
    try {
      const response = await fetch(
        `${fetchApi.getAboutChannel.url}/${user._id}`,
        {
          method: fetchApi.getAboutChannel.method,
          credentials: "include",
        }
      );

      const dataRes = await response.json();

      if (dataRes.success) {
        setAboutChannel(dataRes?.data);
      }
    } catch (error) {
      toast.error("somthing went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    getAboutDetails().then(() => {
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-14">
        <img src={loader} width={80} height={80} alt="loaderGif" />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center gap-2 px-3 py-3">
        <div>
          <h2 className="mb-2 text-2xl">@{userName}</h2>
        </div>
        <div className="gap-1">
          <h1 className="text-2xl mb-2">Channel Details</h1>
          <div className="flex items-center mb-1 gap-2">
            <span>
              <Mail />
            </span>
            <Link to={`mailTo:${user?.mail}`}>{user?.email}</Link>
          </div>
        </div>
        <div className="flex items-center mb-1 gap-2">
          <GlobeIcon />
          <Link to={`/channel/${userName}`}>{`http:localhost:5173/channel/${userName}`}</Link>
        </div>
        <div className="flex items-center mb-1 gap-2">
          <Video />
          <span>{aboutChannel?.totalVideos}</span>{" "}Videos
        </div>
        <div className="flex items-center mb-1 gap-2">
          <Eye />
          <span>{aboutChannel?.totalViews}</span>{" "}Views
        </div>
        <div className="flex items-center mb-1 gap-2">
          <ThumbsUp/>
          <span>{aboutChannel?.totalLikes}</span>{" "}Likes
        </div>
        <div className="flex items-center mb-1 gap-2">
          <InfoIcon />
          Joined on{" "}<span>{user?.createdAt}</span>
        </div>
      </div>
    );
  }
};

export default About;
