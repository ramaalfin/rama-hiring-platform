import { cookies } from "next/headers";
import { getBlogById } from "@/lib/api";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default async function BlogDetailPage({ params }: Props) {
  const token = cookies().get("accessToken")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    const blog = await getBlogById(params.id, token || "");

    return (
      <div className="p-6">
        <nav className="mb-4">
          <ol className="list-reset flex text-gray-700">
            <li>
              <Link href="/blog" className="text-blue-600 hover:underline">
                Blogs
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-500">{blog.title}</li>
          </ol>
        </nav>
        <div className="">
          <h4 className="text-lg font-semibold">{blog.title}</h4>
          <p className="text-sm text-gray-500">By {blog.author.fullName}</p>
          <p className="mt-8">{blog.content}</p>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      redirect("/");
    }
    throw error;
  }
}
