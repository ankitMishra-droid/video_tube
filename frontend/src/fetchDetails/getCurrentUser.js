import { setUserDetails } from "@/features/authSlice";

export const getCurrentUser = async(dispatch) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetch(`http://localhost:7000/api/users/get-current-user`, {
            headers: {
                'Content-Type': 'application/json',
                // "Authorization": `Bearer ${accessToken}`
            }
        })
        
        console.log("get current user",response)
        const dataRes = await response.json()
        console.log("get current user",dataRes)
        console.log(accessToken)
        if(dataRes?.data?.data){
            dispatch(setUserDetails(dataRes?.data?.data))
            return dataRes.data
        }else{
            console.error("failed to fetch data")
        }
    } catch (error) {
        console.log(error)
    }
}