import React, { useEffect, useState } from "react";
import ChannelEmptySubscriber from "./ChannelEmptySubscriber";
import { useDispatch, useSelector } from "react-redux";
import getUserSubscriber from "@/fetchDetails/getSubscribers";
import LoadingImg from "@/assets/loader.gif";
import SubscriptionCards from "../subscription/SubscriptionCards";

const ChannelSubscribed = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const data = useSelector((state) => state.user.userSubscribed);

  useEffect(() => {
    if (user?._id) {
      getUserSubscriber(dispatch, user?._id).then(() => {
        setFilter(data?.[0]?.channels); // Set initial filter state
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

  if (!data || !data[0]?.channelsCount) {
    return <ChannelEmptySubscriber />;
  }

  const subscribed = filter || data?.[0]?.channels;

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

  return (
    <>
      {subscribed?.map((profile) => (
        <SubscriptionCards key={profile?._id} profile={profile} />
      ))}
    </>
  );
};

export default ChannelSubscribed;
