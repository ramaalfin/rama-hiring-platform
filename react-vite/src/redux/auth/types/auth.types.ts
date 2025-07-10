export interface User {
  id: string;
  fullName: string;
  email: string;
  verified: boolean;
  isTwoFAEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  userAgent?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

export interface VerificationRequest {
  code: string;
}

export interface ResetPasswordRequest {
  password: string;
  verificationCode: string;
}

export interface Session {
  id: string;
  userId: string;
  userAgent?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
