import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";

/**
 * Single global Axios instance configured for MediVerify Flask backend communication.
 * Do not create duplicate Axios instances in services or components.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically attach JWT token if available in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized API Error Handling (401, 403, 500, etc.)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let friendlyMessage = "An unexpected error occurred. Please try again later.";
    const status = error.response?.status;
    const data = error.response?.data;

    if (data && typeof data === "object" && data.message) {
      friendlyMessage = data.message;
    } else if (error.message === "Network Error") {
      friendlyMessage = "Unable to connect to server. Please check your network or backend server.";
    } else if (error.code === "ECONNABORTED") {
      friendlyMessage = "Request timed out. Please try again.";
    }

    // Handle specific HTTP status codes
    if (status === 401) {
      // 401 Unauthorized: Remove token from storage and emit global logout event
      removeToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("mediverify:unauthorized"));
      }
      friendlyMessage = data?.message || "Session expired or unauthorized. Please log in again.";
    } else if (status === 403) {
      // 403 Forbidden: Permission denied
      friendlyMessage = data?.message || "Access denied: You do not have permission to perform this action.";
    } else if (status === 404) {
      friendlyMessage = data?.message || "Requested resource was not found.";
    } else if (status >= 500) {
      friendlyMessage = data?.message || "Internal server error. Please try again later.";
    }

    // Attach human-readable message to error object for consumption in services/hooks
    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
