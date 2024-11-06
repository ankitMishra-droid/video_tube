import { toast } from "react-toastify";

export const healthCheck = async() => {
    try {
        const response = await fetch(`http://localhost:7000/healthCheck`)

        const resData = await response.json()

        return resData.data.data
    } catch (error) {
        toast.error("Oops! server not working")
        console.log(error)
    }
}