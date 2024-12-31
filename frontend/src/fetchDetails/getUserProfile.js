import { addUser } from "@/features/userSlice";
import axiosFetch from "@/helpers/fetchData";

export const getUseProfile = async(dispatch, userName) => {
    try {
        const response = await axiosFetch.get(`/users/channel-name/${userName}`)

        if(response?.data?.data){
            dispatch(addUser(response.data.data))
            return response.data.data;
        }
    } catch (error) {
        console.log(error)
    }
}