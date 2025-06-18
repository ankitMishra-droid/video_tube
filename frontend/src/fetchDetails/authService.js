import fetchApi from "@/common"

const fetchRefreshToken = async(navigate, toast) => {
    try {
        const response = await fetch(fetchApi.getRefreshToken.url, {
            method: fetchApi.getRefreshToken.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        const resData = await response.json()
        if(resData?.data){
            localStorage.setItem("accessToken", resData?.data?.accessToken)
            localStorage.setItem("refreshToken", resData?.data?.refreshToken)
            return resData.data.expiresIn
        }else{
            toast.error("Session expired, please login")
            navigate("/login");
            return null
        }
    } catch (error) {
        toast.error("failed to refresh token.")
        navigate("/login")
        return null;
    }
}

const scheduleRefreshToken = async(navigate, toast, expiresIn) => {
    const refreshTime = (expiresIn - 60) * 1000;
    console.log(refreshTime)
    setTimeout(async() => {
        const newExpiresIn = await fetchRefreshToken(navigate, toast)
        if(newExpiresIn) scheduleRefreshToken(navigate, toast, newExpiresIn)
    },refreshTime)
}

export { fetchRefreshToken, scheduleRefreshToken }