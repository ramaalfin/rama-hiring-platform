"use client";

import { useBlogById, useBlogs } from "@/hooks/use-blog";
import { useParams } from "next/navigation";

const DetailBlogPage = () => {
  const params = useParams();
  const blogId = params.id as string;
  const { data: blog, isLoading, error } = useBlogById(blogId);

  console.log("Blog Data:", blog);


  if (isLoading) return (
    // place a loading component on the center of the page
    <div className="flex items-center justify-center h-screen">
      <div>Loading...</div>
    </div>
  )

  return (
    <div className="p-6">
      {error && <div className="text-red-500">Error: {error.message}</div>}
      {blog && (
        <div className="">
          <h4 className="text-lg font-semibold">{blog.data.title}</h4>
          <p className="text-sm text-gray-500">By {blog.data.author.fullName}</p>
          <p className="mt-8">{blog.data.content}</p>
        </div>
      )}
    </div>
  )
}

export default DetailBlogPage;