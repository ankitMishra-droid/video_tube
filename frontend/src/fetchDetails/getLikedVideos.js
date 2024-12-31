import { addLikedVideos } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

export const fetchLikedVideos = async(dispatch) => {
    try {
        const response = await axiosFetch.get("/like/videos");

        if(response?.data?.data){
            dispatch(addLikedVideos(response.data.data))
            return response.data.data;
        }
    } catch (error) {
        console.log(error)
    }
}