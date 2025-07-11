import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authSlice";
import sessionReducer from "../reducers/sessionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
