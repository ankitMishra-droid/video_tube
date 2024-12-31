import { toast } from "react-toastify";
import axios from "axios";

const backendDomain =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

const axiosFetch = axios.create({
  baseURL: `${backendDomain}/api`,
  withCredentials: true,
});

function parseErrorMessage(responseHTMLString) {
  const parser = new DOMParser();
  const responseDocument = parser.parseFromString(
    responseHTMLString,
    "text/html"
  );
  const errorMessageElement = responseDocument.querySelector("pre");

  if (errorMessageElement) {
    const errorMessage = errorMessageElement.textContent.match(
      /^Error:\s*(.*?)(?=\s*at)/
    );
    if (errorMessage && errorMessage[1]) {
      return errorMessage[1].trim();
    }
  }

  return "Something went wrong 😕";
}

axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosFetch.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const errorMsg = parseErrorMessage(error.response.data);
    const originalRequest = error.config;
    console.log(error.response.status);
    if (
      error.response.status === 401 &&
      errorMsg === "TokenExpiredError" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "/api/users/refresh-access-token",
          {},
          { withCredentials: true }
        );
        console.log(data.data.accessToken)
        localStorage.setItem("accessToken", data.data.accessToken);
        axiosFetch.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return axiosFetch(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token", err);
        localStorage.removeItem("accessToken");
        window.location.reload();
        toast.error("Session expired. Please login again!");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosFetch;
