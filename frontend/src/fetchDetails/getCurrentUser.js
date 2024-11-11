import fetchApi from "@/common";
import { setUserDetails } from "@/features/authSlice";

export const getCurrentUser = async(dispatch) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetch(fetchApi.cuurentUser.url, {
            method: fetchApi.cuurentUser.method,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            }
        })
        
        const dataRes = await response.json()
        
        if(dataRes?.data){
            dispatch(setUserDetails(dataRes?.data))
            return dataRes.data
        }else{
            console.error("failed to fetch data")
        }
    } catch (error) {
        console.log(error)
    }
}