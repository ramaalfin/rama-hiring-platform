import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  VerificationRequest,
  ResetPasswordRequest,
} from "../types/auth.types";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    credentials: "include", // Include cookies for session management
    prepareHeaders: (headers) => {
      // Add any additional headers if needed
      headers.set("Content-Type", "application/json");

      const token = Cookies.get("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Add user-agent
      if (navigator.userAgent) {
        headers.set("User-Agent", navigator.userAgent);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "User", "Session"],
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          ...credentials,
          userAgent: navigator.userAgent,
        },
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Register mutation
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          ...userData,
          userAgent: navigator.userAgent,
        },
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Logout mutation
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => "/user",
      providesTags: ["User"],
    }),

    getCurrentSession: builder.query({
      query: () => "/sessions",
      providesTags: ["Session"],
    }),

    // Verify email
    verifyEmail: builder.mutation<{ message: string }, VerificationRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Reset password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      invalidatesTags: ["Auth", "User", "Session"],
    }),

    // Forgot password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetCurrentSessionQuery,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
} = authApi;
