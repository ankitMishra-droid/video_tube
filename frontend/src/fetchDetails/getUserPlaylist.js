import fetchApi from "@/common";
import { addUserPlaylist } from "@/features/userSlice";

const getUserPlayList = async (dispatch) => {
    try {
        const response = await fetch(`${fetchApi.getUserPlayList.url}/u/${userId}`, {
            method: fetchApi.getUserPlayList.method,
            credentials: "include"
        })

        const dataRes = await response.json();

        console.log(dataRes)
        if(dataRes?.data){
            dispatch(addUserPlaylist(dataRes?.data));
            return dataRes.data
        }
    } catch (error) {
        console.log(error)
    }
}

export default getUserPlayList;