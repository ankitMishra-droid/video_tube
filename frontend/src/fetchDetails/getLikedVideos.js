import fetchApi from "@/common";
import { addLikedVideos } from "@/features/userSlice";

export const fetchLikedVideos = async(dispatch) => {
    try {
        const response = await fetch(`${fetchApi.getLikedVideos.url}`, {
            method: fetchApi.getLikedVideos.method,
            credentials: "include"
        });

        const dataRes = await response.json();
        if(dataRes?.data){
            dispatch(addLikedVideos(dataRes.data))
            return dataRes.data;
        }
    } catch (error) {
        console.log(error)
    }
}