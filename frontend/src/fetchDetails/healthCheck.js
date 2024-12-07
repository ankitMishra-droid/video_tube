import { toast } from "react-toastify";

export const healthCheck = async() => {
    try {
        const response = await fetch(`https://video-tube-indol.vercel.app/healthCheck`)

        const resData = await response.json()

        return resData.data.data
    } catch (error) {
        toast.error("Oops! server not working")
        console.log(error)
    }
}
