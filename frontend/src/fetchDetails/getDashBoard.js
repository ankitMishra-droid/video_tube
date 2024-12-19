import { setStats } from "@/features/dashboardSlice";
import fetchApi from "@/common";
import { toast } from "react-toastify";
import { setVideo } from "@/features/dashboardSlice";

async function getDashboardStats(dispatch, userId) {
  try {
    const response = await fetch(`${fetchApi.channelStats.url}/${userId}`, {
      method: fetchApi.channelStats.method,
      credentials: "include",
    });

    const resData = await response.json();
    if (resData.data) {
      dispatch(setStats(resData.data));
      return resData.data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getChannelVideos(dispatch) {
    try {
        const response = await fetch(`${fetchApi.channelStats.url}/videos`,{
          method: "GET",
          credentials: "include"
        });
    
        const resData = await response.json();
        if(resData.data){
            dispatch(setVideo(resData.data));
        }
    } catch (error) {
        console.log(error)
    }
}

export { getDashboardStats, getChannelVideos };
