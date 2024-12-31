import fetchApi from "@/common";
import { addUserPlaylist } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

const getUserPlayList = async (dispatch, userId) => {
    try {
        const response = await axiosFetch.get(`/playlist/u/${userId}`)
        if(response?.data?.data){
            dispatch(addUserPlaylist(response.data.data));
            return response.data.data
        }
    } catch (error) {
        console.log(error)
    }
}

export default getUserPlayList;