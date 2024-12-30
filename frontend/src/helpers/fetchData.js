// axiosConfig.js
import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance for API calls
const axiosFetch = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true, // Important for handling cookies
  timeout: 5000,
});

// Function to parse error messages
const parseErrorMessage = (error) => {
  if (error.response?.data) {
    return error.response.data.message || error.response.data.meessage || "Something went wrong";
  }
  return error.message || "Something went wrong";
};

// Request interceptor
axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("setting token: ", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("config: ", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosFetch.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops.
      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the stored refresh token.

        const response = await axios.post("/users/refresh-access-token", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return axios(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export default axiosFetch;