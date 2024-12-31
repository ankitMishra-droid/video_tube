import { addUserSubscribed } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

async function getUserSubscriber(dispatch, subscribedId){
    try {
        const response = await axiosFetch.get(`/subscribe/a/${subscribedId}`);
    
        if(response?.data?.data){
            dispatch(addUserSubscribed(response.data.data))
            return response.data.data
        }
    } catch (error) {
        console.log(error)
    }
}

export default getUserSubscriber