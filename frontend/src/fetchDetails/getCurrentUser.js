import { setUserDetails } from "@/features/authSlice";

export const getCurrentUser = async(dispatch) => {
    try {
        const response = await fetch(`http://localhost:7000/api/users/get-current-user`)

        const dataRes = await response.json()

        if(dataRes?.data?.data){
            dispatch(setUserDetails(dataRes?.data?.data))
            return dataRes.data
        }
    } catch (error) {
        console.log(error)
    }
}