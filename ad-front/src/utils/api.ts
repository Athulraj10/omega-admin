import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { url } from "./helper";
import { getLocalStorageItem } from "./helperWindows";

const api = axios.create({
  baseURL: url,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getLocalStorageItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    // Check for 401 status or invalidToken message
    if (error.response?.status === 401 || (error.response?.data as any)?.meta?.code === 401) {
      console.log("Authentication error detected, clearing token and redirecting...");
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("user");
      // Clear any other auth-related data
      sessionStorage.clear();
      // Redirect to login page
      window.location.href = "/sign-in";
    } else {
      // Only log as error if it's not a 400 validation error
      if (error.response?.status !== 400) {
        console.error("API Error:", error);
        if (error.response?.data) {
          console.error("Error Response:", error.response.data);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
