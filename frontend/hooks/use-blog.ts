"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlogMutationFn,
  deleteBlogMutationFn,
  getBlogsQueryFn,
  updateBlogMutationFn,
} from "@/lib/api";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => getBlogsQueryFn(),
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      // Handle error if needed
      console.error("Error creating blog");
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlogMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useDeleteBlog(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBlogMutationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
