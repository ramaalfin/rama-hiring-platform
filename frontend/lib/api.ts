import API from "./axios-client";

type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordType = {
  email: string;
};

type ResetPasswordType = {
  password: string;
  verificationCode: string;
};

type VerifyEmailType = {
  code: string;
};

type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  expiresAt: string;
  createdAt: string;
  isCurrent: boolean;
};

type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

export const loginMutationFn = async (data: LoginType) => {
  await API.post("/auth/login", data);
};

export const registerMutationFn = async (data: RegisterType) => {
  await API.post("/auth/register", data);
};

export const forgotPasswordMutationFn = async (data: ForgotPasswordType) => {
  await API.post("/auth/password/forgot", data);
};

export const resetPasswordMutationFn = async (data: ResetPasswordType) => {
  await API.post("/auth/password/reset", data);
};

export const verifyEmailMutationFn = async (data: VerifyEmailType) => {
  await API.post("/auth/email/verify", data);
};

export const getUserSessionQueryFn = async () => await API.get("/sessions/");

export const sessionQueryFn = async () => {
  const response = await API.get<SessionResponseType>("/sessions/all");
  return response.data;
};

export const sessionDeleteMutationFn = async (id: string) => {
  await API.delete(`/sessions/${id}`);
};

export const logoutMutationFn = async () => {
  await API.get("/auth/logout");
};
