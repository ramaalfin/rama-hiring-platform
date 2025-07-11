import api from "../config/api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Session,
} from "../types";

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.get("/auth/logout");
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.get("/auth/refresh");
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/user");
    return response.data;
  }

  async getAllSessions(): Promise<Session[]> {
    const response = await api.get("/sessions/all");
    return response.data;
  }

  async getCurrentSession(): Promise<Session> {
    const response = await api.get("/sessions");
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`);
  }
}

export const authService = new AuthService();
export default authService;
