import fetchApi from "@/common";
import { addUser } from "@/features/userSlice";

export const getUseProfile = async(dispatch, userName) => {
    try {
        const response = await fetch(`${fetchApi.userProfile.url}/${userName}`, {
            method: fetchApi.userProfile.method,
            credentials: "include"
        })

        const dataRes = await response.json()

        if(dataRes?.data){
            dispatch(addUser(dataRes?.data))
            return dataRes.data;
        }
    } catch (error) {
        console.log(error)
    }
}