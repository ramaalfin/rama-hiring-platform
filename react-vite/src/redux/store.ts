import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./auth/slices/authSlice";
import { authApi } from "./auth/services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: import.meta.env.DEV,
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to access the store's state and dispatch
export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected = (selector) => {
  return selector(store.getState());
};

export const useAppDispatch = () => {
  return store.dispatch;
};
