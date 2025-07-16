"use server";

import { getBlogsQueryFn } from "./api";

export async function getBlogsAction() {
  try {
    const response = await getBlogsQueryFn();
    return response;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message: "Failed to fetch blogs",
    };
  }
}
