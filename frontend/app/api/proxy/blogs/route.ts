// app/api/proxy/blogs/route.ts
import { fetchWithAuth } from "@/lib/server-fetch";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await fetchWithAuth(req, "/blogs");
}
