// app/blog/page.tsx

import BlogList from "./_components/blogList";
import CreateForm from "./_components/CreateForm";

export default function BlogPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold mb-4">Blogs</h3>
        <CreateForm />
      </div>

      <BlogList />
    </div>
  );
}
