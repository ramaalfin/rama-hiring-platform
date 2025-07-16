"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogByIdQueryFn, getBlogsQueryFn } from "@/lib/api";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogsQueryFn,
  });
}

export function useBlogById(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogByIdQueryFn(id),
  });
}
