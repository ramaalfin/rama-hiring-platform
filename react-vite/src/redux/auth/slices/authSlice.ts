import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import type { AuthState, User } from "../types/auth.types";
import Cookie from "js-cookie";
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoading = false;
      state.error = null;
      // Or use cookies
      Cookie.set("accessToken", accessToken, { expires: 7 }); // 7
      Cookie.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = null;
      Cookie.remove("accessToken");
      Cookie.remove("refreshToken");
    },
    refreshTokens(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoading = false;
      state.error = null;
      // Update cookies
      Cookie.set("accessToken", accessToken, { expires: 7 }); // 7
      Cookie.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
    },
    // Manual actions
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || "Login failed";
      });
    // Register
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.error = null;
          if (action.payload.user) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
          }
        }
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      });
    // Logout
    builder
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Logout failed";
      });
    // Get current user
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Don't set error for getCurrentUser failure (user might just not be logged in)
      });
  },
});
export const { setUser, clearUser, setLoading, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
