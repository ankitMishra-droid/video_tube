import React, { useEffect, useState } from "react";
import ChannelEmptySubscriber from "./ChannelEmptySubscriber";
import { useDispatch, useSelector } from "react-redux";
import getUserSubscriber from "@/fetchDetails/getSubscribers";
import LoadingImg from "@/assets/loader.gif";
import SubscriptionCards from "../subscription/SubscriptionCards";

const ChannelSubscribed = () => {
  const user = useSelector((state) => state?.user?.user);
  const status = useSelector((state) => state.auth.status)
  const dispatch = useDispatch();

  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const data = useSelector((state) => state.user.userSubscribed);

  useEffect(() => {
    if (user?._id) {
      getUserSubscriber(dispatch, user?._id).then(() => {
        setFilter(data?.channels);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <img src={LoadingImg} className="w-24 h-24" alt="loading gif" />
      </div>
    );
  }

  const subscribed = filter || data?.channels;

  function handleInput(input) {
    if (!input || input === "") {
      setFilter(data?.[0]?.channels);
    } else {
      const filteredData = data?.[0]?.channels.filter(
        (subs) =>
          subs.firstName.toLowerCase().includes(input.toLowerCase()) ||
          subs.lastName.toLowerCase().includes(input.toLowerCase())
      );
      setFilter(filteredData);
    }
  }

  return data?.channelsCount > 0 && status ? (
    <>
      <div className="my-5">
        {subscribed?.map((profile) => (
          <SubscriptionCards key={profile?._id} profile={profile} />
        ))}
      </div>
    </>
  ) : (
    <>
      <ChannelEmptySubscriber />
    </>
  );
};

export default ChannelSubscribed;
