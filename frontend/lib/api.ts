import { cookies } from "next/headers";
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

export type BlogType = {
  id: string;
  title: string;
  content: string;
  author: {
    fullName: string;
  };
};

// authentication API calls
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

// blogs API calls
export const getBlogsQueryFn = async () => {
  const response = await API.get("/blogs");
  return response.data;
};
// export const getBlogByIdQueryFn = async (id: string) => {
//   const response = await API.get(`/blogs/${id}`);
//   return response.data;
// };

export async function getBlogById(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${id}`,
    {
      credentials: "include",
      headers: {
        Cookie: token ? `accessToken=${token}` : "",
      },
      next: { revalidate: 0 },
    }
  );

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to fetch blog");

  const { data } = await res.json();
  return data;
}

export const createBlogMutationFn = async (data: {
  title: string;
  content: string;
}) => {
  try {
    const response = await API.post("/blogs", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateBlogMutationFn = async ({
  id,
  data,
}: {
  id: string;
  data: {
    title: string;
    content: string;
  };
}) => {
  const response = await API.put(`/blogs/${id}`, data);
  return response.data;
};

export const deleteBlogMutationFn = async (id: string) => {
  const response = await API.delete(`/blogs/${id}`);
  return response.data;
};
