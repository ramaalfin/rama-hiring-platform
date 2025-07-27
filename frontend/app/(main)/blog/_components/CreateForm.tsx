"use client";
import { useState } from "react";
import { useCreateBlog, useBlogs } from "@/hooks/use-blog";
import { blogFormSchema, BlogFormValues } from "@/lib/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateForm() {
  const [open, setOpen] = useState(false);
  const { refetch } = useBlogs(); // refetch daftar blog

  const { mutate: createBlog, isPending } = useCreateBlog();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({ resolver: zodResolver(blogFormSchema) });

  const onSubmit = (values: BlogFormValues) => {
    createBlog(values, {
      onSuccess: () => {
        toast({ title: "Blog created successfully", description: "Your blog has been created.", variant: "default" });
        refetch();
        reset();
        setOpen(false);
      },
      onError: () => {
        toast({ title: "Error creating blog", description: "Failed to create blog", variant: "destructive" });
      }
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
          <DialogDescription>Fill out the form and click save to create a blog.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Controller name="title" control={control} render={({ field }) => <Input id="title" {...field} />} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Controller name="content" control={control} render={({ field }) => <Input id="content" {...field} />} />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}