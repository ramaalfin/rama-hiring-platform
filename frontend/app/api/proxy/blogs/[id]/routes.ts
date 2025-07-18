// app/api/proxy/blogs/[id]/route.ts
import { fetchWithAuth } from "@/lib/server-fetch";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return await fetchWithAuth(req, `/blogs/${params.id}`);
}
