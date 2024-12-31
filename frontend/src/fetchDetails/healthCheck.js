import fetchApi from "@/common";
import axiosFetch from "@/helpers/fetchData";
import { toast } from "react-toastify";

export const healthCheck = async() => {
    try {
        const response = await axiosFetch.get("/healthCheck")
        return response.data.data
    } catch (error) {
        toast.error("Oops! server not working")
        console.log(error)
    }
}
