import fetchApi from "@/common";
import { toast } from "react-toastify";

export const healthCheck = async() => {
    try {
        const response = await fetch(fetchApi.siteCheck.url, {
            method: fetchApi.siteCheck.method
        })

        const resData = await response.json()

        return resData.data.data
    } catch (error) {
        toast.error("Oops! server not working")
        console.log(error)
    }
}
