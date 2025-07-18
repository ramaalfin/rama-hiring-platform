// lib/schema.ts
import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  content: z.string().min(5, "Content is too short"),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
