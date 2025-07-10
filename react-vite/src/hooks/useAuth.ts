import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/redux/auth/services/authApi";
import { clearUser } from "@/redux/auth/slices/authSlice";
import { useAppSelector } from "@/redux/store";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const [logoutMutation] = useLogoutMutation();
  const { refetch: refetchUser } = useGetCurrentUserQuery();
  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      dispatch(clearUser());
      navigate("/login");
    }
  }, [logoutMutation, dispatch, navigate]);
  const refreshUser = useCallback(async () => {
    try {
      await refetchUser();
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [refetchUser]);
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refreshUser,
  };
};
