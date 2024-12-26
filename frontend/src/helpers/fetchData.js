import { toast } from "react-toastify";
import axios from "axios";

const axiosFetch = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true, // Ensures cookies are sent with requests
});

function parseErrorMessage(responseHTMLString) {
  const parser = new DOMParser();
  const responseDocument = parser.parseFromString(responseHTMLString, "text/html");
  const errorMessageElement = responseDocument.querySelector("pre");

  if (errorMessageElement) {
    const error = errorMessageElement.textContent.match(/^Error:\s*(.*?)(?=\s*at)/);
    if (error && error[1]) {
      return error[1].trim();
    }
  }

  return "Something went wrong";
}

// Request interceptor to add Authorization header
axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
axiosFetch.interceptors.response.use(
  (response) => response, // Successful responses
  async (error) => {
    const errorMsg = parseErrorMessage(error.response.data);
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      errorMsg === "invalid access token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid infinite retries

      try {
        const { data } = await axios.get("/users/refresh-access-token", {
          withCredentials: true,
        });
        console.log(data.data.accessToken)
        localStorage.setItem("accessToken", data.data.accessToken);
        axiosFetch.defaults.headers.common["Authorization"] = `Bearer ${data.data.accessToken}`;
        return axiosFetch(originalRequest); // Retry the original request
      } catch (refreshError) {
        toast.error("Session expired, please log in again.");
        localStorage.removeItem("accessToken");
        window.location.reload("/login"); // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default axiosFetch;
