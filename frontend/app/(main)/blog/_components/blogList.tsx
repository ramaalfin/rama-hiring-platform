import Link from "next/link";
import { useBlogs } from "@/hooks/use-blog";
import EditForm from "./EditForm";

export default function BlogList({ onDelete }: { onDelete: (id: string) => void }) {
  const { data: blogs, isLoading } = useBlogs();

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-4">
      {blogs?.data?.map((blog: any) => (
        <li key={blog.id} className="border p-4 rounded">
          <h3 className="text-lg font-bold">{blog.title}</h3>
          <p>{blog.content}</p>
          <div className="flex gap-4 mt-2">
            <Link href={`/blog/${blog.id}`} className="text-blue-600" replace>
              View
            </Link>
            <p
              className="cursor-pointer text-red-500"
              onClick={() => onDelete(blog.id)}
            >
              Delete
            </p>
            <EditForm
              id={blog.id}
              defaultValues={{
                title: blog.title,
                content: blog.content,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}