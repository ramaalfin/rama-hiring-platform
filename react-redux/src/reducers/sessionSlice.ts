import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Session, ApiError } from "../types";
import authService from "../services/auth.services";

export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getAllSessions = createAsyncThunk<
  Session[],
  void,
  { rejectValue: string }
>("session/getAllSessions", async (_, { rejectWithValue }) => {
  try {
    const sessions = await authService.getAllSessions();
    return sessions;
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message);
  }
});

export const getCurrentSession = createAsyncThunk<
  Session,
  void,
  { rejectValue: string }
>("session/getCurrentSession", async (_, { rejectWithValue }) => {
  try {
    const session = await authService.getCurrentSession();
    return session;
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message);
  }
});

export const deleteSession = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("session/deleteSession", async (sessionId, { rejectWithValue }) => {
  try {
    await authService.deleteSession(sessionId);
    return sessionId;
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message);
  }
});

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    resetSessions: (state) => {
      state.sessions = [];
      state.currentSession = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all sessions
      .addCase(getAllSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(getAllSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Gagal mendapatkan data sesi";
      })
      // Get current session
      .addCase(getCurrentSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
      })
      .addCase(getCurrentSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Gagal mendapatkan data sesi saat ini";
      })
      // Delete session
      .addCase(deleteSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.filter(
          (session) => session.id !== action.payload
        );
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Gagal menghapus sesi";
      });
  },
});

export const { clearSessionError, resetSessions } = sessionSlice.actions;
export default sessionSlice.reducer;
