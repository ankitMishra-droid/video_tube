import fetchApi from "@/common";
import { setStats } from "@/features/dashboardSlice";
import axiosFetch from "@/helpers/fetchData";
import { toast } from "react-toastify";

const getChannelStats = async(dispatch, userId) => {
    try {
        const response = await axiosFetch.get(`/dashboard/${userId}`);

        if(response?.data?.data){
            dispatch(setStats(response.data.data))
        }
    } catch (error) {
        toast.error('Error getting channel stats')
        console.log(error)
    }
}