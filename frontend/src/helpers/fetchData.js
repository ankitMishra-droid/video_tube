import { toast } from "react-toastify";
import axios from "axios";

const axiosFetch = axios.create({
    baseURL: "http://localhost:7000/api",
    withCredentials: true
})

function parseErrorMessage(errorData){
    return errorData?.message || "somthing went wrong"
}

axiosFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if(token){
        config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

axiosFetch.interceptors.response.use((response) => {
    return response
}, async(error) => {
    const errorMsg = parseErrorMessage(error.response.data)
    const originalRequest = error.config;
    if(error.response.status === 401 && errorMsg === "invalid access token" && !originalRequest._retry){
        originalRequest._retry = true;
        try {
            const {data} = await axios.post("api/users/refresh-token",
                {},
                { withCredentials: true }
            );
            
            localStorage.setItem("accessToken", data.data.accessToken);
            axiosFetch.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`

            return axiosFetch(originalRequest)
        } catch (error) {
            console.error(`failed to refresh token: ${error}`);
            localStorage.removeItem("accessToken");
            window.location.reload();
            toast.error("session expired, please login")
        }
    }
})

export default axiosFetch;