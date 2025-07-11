export interface User {
  id: string;
  fullName: string;
  email: string;
  verified: boolean;
  isTwoFAEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  user?: Pick<User, "id" | "fullName" | "email">;
}

export interface ApiError {
  message: string;
  statusCode: number;
  appErrorCode?: string;
}
