import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { ApiError } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan user-agent
api.interceptors.request.use(
  (config) => {
    config.headers["User-Agent"] = navigator.userAgent;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Terjadi kesalahan pada server",
      statusCode: error.response?.status || 500,
      appErrorCode: error.response?.data?.appErrorCode,
    };

    // Jika token expired, coba refresh
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/refresh")
    ) {
      return handleTokenRefresh(error.config);
    }

    return Promise.reject(apiError);
  }
);

const handleTokenRefresh = async (originalRequest: AxiosRequestConfig) => {
  try {
    await api.get("/auth/refresh");
    return api(originalRequest);
  } catch (refreshError) {
    // Jika refresh gagal, redirect ke login
    window.location.href = "/login";
    return Promise.reject(refreshError);
  }
};

export default api;
