import { setTweets } from "@/features/userTweets";
import axiosFetch from "@/helpers/fetchData";

export const getUserTweet = async(dispatch, userId) => {
    try {
        const res = await axiosFetch.get(`/tweet/get-user-tweet/${userId}`);

        if(res.data.data){
            console.log(res.data.data)
            dispatch(setTweets(res.data.data))
            return res.data.data
        }
    } catch (error) {
        console.log(error)
    }
}