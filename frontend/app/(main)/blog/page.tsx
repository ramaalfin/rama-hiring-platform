"use client";

import { useBlogs } from "@/hooks/use-blog";
import { BlogType } from "@/lib/api";
import Link from "next/link";

const BlogPage = () => {
  const { data: blogs, isLoading, error } = useBlogs();

  if (isLoading) return (
    // place a loading component on the center of the page
    <div className="flex items-center justify-center h-screen">
      <div>Loading...</div>
    </div>
  )

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Blogs</h3>
      {error && <div className="text-red-500">Error: {error.message}</div>}
      <ul className="space-y-4">
        {blogs?.data.map((blog: BlogType) => (
          <Link href={`/blog/${blog.id}`} key={blog.id} className="block">
            <li key={blog.id} className="border p-4 rounded-lg">
              <h4 className="text-lg font-semibold">{blog.title}</h4>
              <p>{blog.content}</p>
              <p className="text-sm text-gray-500">By {blog.author.fullName}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default BlogPage;