import fetchApi from "@/common";
import { addUserSubscribed } from "@/features/userSlice";

async function getUserSubscriber(dispatch, subscribedId){
    try {
        const response = await fetch(`${fetchApi.getUserSubscriber.url}/a/${subscribedId}`, {
            method: fetchApi.getUserSubscriber.method,
            credentials: "include"
        });
    
        const resData = await response.json();
        if(resData?.data){
            dispatch(addUserSubscribed(resData.data))
            return resData.data
        }
    } catch (error) {
        console.log(error)
    }
}

export default getUserSubscriber