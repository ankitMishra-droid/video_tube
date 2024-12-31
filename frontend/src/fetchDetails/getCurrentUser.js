import { setUserDetails } from "@/features/authSlice";
import axiosFetch from "@/helpers/fetchData";

export const getCurrentUser = async(dispatch) => {
    try {
        const response = await axiosFetch.get("/users/get-current-user")

        if(response?.data?.data){
            dispatch(setUserDetails(response?.data?.data))
            return response?.data?.data
        }else{
            console.error("failed to fetch data")
        }
    } catch (error) {
        console.log(error)
    }
}