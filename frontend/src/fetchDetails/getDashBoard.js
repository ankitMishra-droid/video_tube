import { setStats } from "@/features/dashboardSlice";
import { setVideo } from "@/features/dashboardSlice";
import axiosFetch from "@/helpers/fetchData";

async function getDashboardStats(dispatch, userId) {
  try {
    const response = await axiosFetch.get(`/dashboard/${userId}`);

    if (response?.data?.data) {
      dispatch(setStats(response.data.data));
      return response.data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getChannelVideos(dispatch) {
    try {
        const response = await axiosFetch.get(`/dashboard/videos`);
    
        if(response.data.data){
            dispatch(setVideo(response.data.data));
        }
    } catch (error) {
        console.log(error)
    }
}

export { getDashboardStats, getChannelVideos };
