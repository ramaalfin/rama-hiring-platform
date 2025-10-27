import { cookies } from "next/headers";
import API from "./axios-client";
import { useAuthStore } from "@/stores/authStore";

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
  id: string;
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

// authentication API calls
export const loginMutationFn = async (data: LoginType) => {
  const response = await API.post("/auth/login", data);

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);

  return user;
};


export const magicLoginMutationFn = async (data: { email: string }) => {
  const response = await API.post("/auth/magic-login", data);

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);
}

export const verifyMagicLoginMutationFn = async ({ code }: { code: string }) => {
  const response = await API.get("/auth/magic-login/verify", {
    params: { code },
    headers: {
      // flag untuk memberitahu interceptor agar tidak mencoba refresh auth
      "x-skip-refresh": "1",
    },
  });

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);

  return response.data;
};

export const registerMutationFn = async (data: RegisterType) => {
  const response = await API.post("/auth/register", data);

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);
};

export const magicRegisterMutationFn = async (data: { email: string }) => {
  const response = await API.post("/auth/magic-register", data);

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);
};

export const verifyMagicRegisterMutationFn = async ({ code }: { code: string }) => {
  const response = await API.get("/auth/magic-register/verify", {
    params: { code },
    headers: {
      "x-skip-refresh": "1",
    },
  });

  const result = response.data;
  const user = result?.user;

  // Simpan user ke Zustand
  const { setUser } = useAuthStore.getState();
  setUser(user);

  return response.data;
}

export const forgotPasswordMutationFn = async (data: ForgotPasswordType) => {
  await API.post("/auth/password/forgot", data);
};

export const resetPasswordMutationFn = async (data: ResetPasswordType) => {
  await API.post("/auth/password/reset", data);
};

export const verifyEmailMutationFn = async (data: VerifyEmailType) => {
  await API.post("/auth/email/verify", data);
};

export const getUserSessionQueryFn = async () => await API.get("/sessions");

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

export const createJobMutationFn = async (data: any, token: string) => {
  const response = await API.post("/jobs", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateJobMutationFn = async (id: string, data: any) => {
  const response = await API.patch(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJobMutationFn = async (id: string) => {
  const response = await API.delete(`/jobs/${id}`);
  return response.data;
};

export const getJobByIdQueryFn = async (id: string) => {
  const response = await API.get(`/jobs/${id}`);
  return response.data;
};

export const getAllJobsQueryFn = async (token: string) => {
  const response = await API.get("/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const getAdminJobsFn = async (adminId: string, token: string) => {
  const response = await API.get(`/jobs/admin/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
