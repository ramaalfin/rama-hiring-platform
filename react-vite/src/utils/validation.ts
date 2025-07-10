// src/utils/validation.ts
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Email tidak valid")
  .min(1, "Email wajib diisi")
  .max(255, "Email terlalu panjang");

export const passwordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .max(255, "Password terlalu panjang");

export const fullNameSchema = z
  .string()
  .min(1, "Nama lengkap wajib diisi")
  .max(255, "Nama lengkap terlalu panjang")
  .regex(/^[a-zA-Z\s]+$/, "Nama lengkap hanya boleh berisi huruf dan spasi");

export const verificationCodeSchema = z
  .string()
  .trim()
  .min(1, "Kode verifikasi wajib diisi")
  .max(25, "Kode verifikasi terlalu panjang");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const verificationEmailSchema = z.object({
  code: verificationCodeSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    verificationCode: verificationCodeSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerificationFormData = z.infer<typeof verificationEmailSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
