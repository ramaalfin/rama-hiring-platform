"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogFormSchema, BlogFormValues } from "@/lib/schema";
import { useCreateBlog } from "@/hooks/use-blog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { revalidateTag } from "next/cache";

export default function CreateForm() {
  const { mutate: createBlog, isPending } = useCreateBlog();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
  });

  const onSubmit = (values: BlogFormValues) => {
    createBlog(values, {
      onSuccess: () => {
        toast({
          title: "Blog created successfully",
          description: "Your blog has been created.",
          variant: "default",
        })
        reset();
        setOpen(false);
        revalidateTag("blogs");
      },
      onError: () => {
        toast({
          title: "Error creating blog",
          description: "Failed to create blog",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Blog</DialogTitle>
          <DialogDescription>
            Fill out the form and click save to create a blog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Input id="content" {...register("content")} />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
