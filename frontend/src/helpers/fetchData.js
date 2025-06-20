import axios from "axios";
import { toast } from "react-toastify";
import { logoutUser, setAccessToken, removeUserDetails } from "@/features/authSlice";
import { store } from "@/store/store";

const backendDomain =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

const axiosFetch = axios.create({
  baseURL: `${backendDomain}/api`,
  withCredentials: true,
});

// Helper: Parse error from HTML response
function parseErrorMessage(responseHTMLString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseHTMLString, "text/html");
    const pre = doc.querySelector("pre");
    const match = pre?.textContent?.match(/^Error:\s*(.*?)(?=\s*at)/);
    return match?.[1]?.trim() || "Something went wrong 😕";
  } catch {
    return "Something went wrong 😕";
  }
}

// Request Interceptor
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

// Response Interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const errMsg = parseErrorMessage(error?.response?.data);

    if (
      status === 401 &&
      errMsg === "TokenExpiredError" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosFetch(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const { data } = await axios.post(
          `${backendDomain}/api/users/refresh-access-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = data?.data || {};

        // Save tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        axiosFetch.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        store.dispatch(setAccessToken(accessToken)); // ✅ Use store directly

        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosFetch(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        toast.error("Session expired. Please log in again.");

        store.dispatch(logoutUser()); // ✅ Use store directly
        store.dispatch(removeUserDetails())
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // toast.error(errMsg || "An error occurred");
    return Promise.reject(error);
  }
);

export default axiosFetch;
