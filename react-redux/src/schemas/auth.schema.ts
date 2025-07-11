import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Format email tidak valid")
  .min(1, "Email harus diisi")
  .max(255, "Email terlalu panjang");

const passwordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .max(255, "Password terlalu panjang");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Nama lengkap harus diisi")
      .max(255, "Nama lengkap terlalu panjang"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(6, "Password konfirmasi minimal 6 karakter")
      .max(255, "Password konfirmasi terlalu panjang"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
