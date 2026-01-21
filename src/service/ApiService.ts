import axios from "axios";
import { API_URL } from "@env";
import { setShowSubscriptionExpireModal } from "../redux/slices/UserSlice";
import {
  deleteLocalStorageData,
  dispatchAction,
  getLocalStorageData,
  resetAndNavigate,
} from "../utils/Helpers";
import STORAGE_KEYS from "../utils/Storage";

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Create the Axios instance
const api = axios.create({
  baseURL: API_URL,
  // baseURL: `https://e78fe8e3ec32.ngrok-free.app/api`,
  // timeout: 10000,
});

// Request interceptor to add auth token dynamically
api.interceptors.request.use(
  async (config) => {
    const token = await getLocalStorageData(STORAGE_KEYS.TOKEN); // Fetch token from AsyncStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Extract API error response
      console.error("API Error:", error.response);

      if (error.response.data.message === "Invalid or expired token") {
        await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
        resetAndNavigate("authStack");
      }
      if (error.response.data.message === "No active subscription found") {
        dispatchAction(setShowSubscriptionExpireModal(true));
      }
      return Promise.reject({
        ...error.response.data,
        status: error.response.status,
      }); // Reject with only response data
    } else {
      // Handle network or unexpected errors
      console.error("Network/Unexpected Error:", error.message);
      return Promise.reject({
        success: false,
        message: "Something went wrong",
      });
    }
  }
);

// API methods with optional headers
export const fetchData = <T>(endpoint: string, params?: any, headers?: any) =>
  api.get<ApiResponse<T>>(endpoint, { params, headers });

export const postData = <T>(endpoint: string, data?: any, headers?: any) =>
  api.post<ApiResponse<T>>(endpoint, data, { headers });

export const postFormData = <T>(endpoint: string, data: FormData) =>
  api.post<ApiResponse<T>>(endpoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const patchData = <T>(endpoint: string, data: any, headers?: any) =>
  api.patch<ApiResponse<T>>(endpoint, data, { headers });

export const putData = <T>(endpoint: string, data: any, headers?: any) =>
  api.put<ApiResponse<T>>(endpoint, data, { headers });

export const putFormData = <T>(endpoint: string, data: FormData) =>
  api.put<ApiResponse<T>>(endpoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteData = <T>(endpoint: string, data?: any, headers?: any) =>
  api.delete<ApiResponse<T>>(endpoint, { data });

export default api;
