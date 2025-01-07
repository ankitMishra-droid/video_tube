import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { setTweets } from "@/features/userTweets";
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
  const dispatch = useDispatch();

  const getAllTweets = async () => {
    // e.preventDefault();

    try {
      const response = await axiosFetch.get(`/tweet/${user?._id}`);

      if (response?.data?.statusCode === 201) {
        console.log(response.data)
        dispatch(setTweets(response.data));
      } else {
        toast.error(response?.data?.message || "something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTweet = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosFetch.post("/tweet", data);

      if (response?.data?.data) {
        toast.success(response.data.message);
        dispatch(setTweets(response?.data))
      }else{
        toast.error(response?.data?.data?.message || "something went wrong")
        console.log(response?.data?.data?.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTweets();
  }, [status]);
  return (
    <div>
      <div>
        <form onSubmit={addTweet} className="w-full lg:w-1/2">
          <Textarea
            className="mb-2"
            rows={10}
            cols={10}
            placeholder="write community post..."
            value={data.content}
            onChange={(e) => setData(e.target.value)}
          />
          <div className="my-2 flex justify-end gap-2">
            <Button>Clear</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tweets;
