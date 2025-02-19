import TweetCard from "@/components/channels/TweetCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { removeTweets, setTweets } from "@/features/userTweets";
import axiosFetch from "@/helpers/fetchData";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Tweets = () => {
  const [data, setData] = useState({
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);
  const tweets = useSelector((state) => state.tweets.tweets);
  const dispatch = useDispatch();

  const getAllTweets = async () => {
    setLoading(true);
    try {
      const response = await axiosFetch.get(`/tweet/get-all-tweets`);
      if (response?.data?.statusCode === 201) { 
        setLoading(false);
        dispatch(setTweets(response.data.data));
      } else {
        dispatch(setTweets(response.data.data));
        toast.error(response?.data?.message || "something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addTweet = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosFetch.post("/tweet", data);
      if (response?.data?.data) {
        toast.success(response.data.message);
        dispatch(setTweets(response?.data?.data));
      } else {
        toast.error(response?.data?.message || "something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTweets();
  }, [status]);

  return (
    <div className="flex flex-col lg:flex-row gap-x-6">
      <div className="sticky top-6 w-full lg:w-1/2">
        <form onSubmit={addTweet} className="w-full">
          <Textarea
            className="mb-2 w-full h-28 sm:h-32 md:h-36 lg:h-48"
            rows={1}
            placeholder="Write your tweet..."
            value={data.content}
            onChange={(e) => setData({ content: e.target.value })}
          />
          <div className="my-2 flex justify-end gap-2">
            <Button>Clear</Button>
            <Button
              type="submit"
              className={`${loading ? "cursor-not-allowed" : ""}`}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full lg:w-1/2 overflow-y-auto max-h-[80vh]">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {tweets && tweets.length > 0 ? (
              tweets.map((tweet) => (
                <div key={tweet?._id}>
                  <TweetCard tweet={tweet} />
                </div>
              ))
            ) : (
              <p>No tweets available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;
