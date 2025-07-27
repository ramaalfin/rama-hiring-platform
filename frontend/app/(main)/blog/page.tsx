"use client";
import { useState } from "react";
import CreateForm from "./_components/CreateForm";
import DeleteDialog from "./_components/DeleteDialog";
import BlogList from "./_components/blogList";

export default function BlogPage() {
  // State untuk mengatur dialog delete
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-start">
        <h3 className="text-xl font-bold mb-4">Blogs</h3>
        <CreateForm />
      </div>
      <BlogList onDelete={setDeleteId} />
      <DeleteDialog id={deleteId} onClose={() => setDeleteId(null)} />
    </div>
  );
}