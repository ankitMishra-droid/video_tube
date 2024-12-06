import fetchApi from "@/common";
import { setStats } from "@/features/dashboardSlice";
import { toast } from "react-toastify";

const getChannelStats = async(dispatch, userId) => {
    try {
        const response = await fetch(`${fetchApi.channelStats.url}/${userId}`, {
            method: fetchApi.channelStats.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resData = await response.json()

        if(resData.data){
            dispatch(setStats(resData.data))
        }
    } catch (error) {
        toast.error('Error getting channel stats')
        console.log(error)
    }
}