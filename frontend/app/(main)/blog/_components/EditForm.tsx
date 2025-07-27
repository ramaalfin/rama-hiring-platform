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
import { useBlogs, useUpdateBlog } from "@/hooks/use-blog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

interface EditFormProps {
  id: string;
  defaultValues: BlogFormValues;
}

export default function EditForm({ id, defaultValues }: EditFormProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateBlog, isPending } = useUpdateBlog();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
  });

  const onSubmit = (values: BlogFormValues) => {
    updateBlog(
      { id, data: values },
      {
        onSuccess: () => {
          toast({
            title: "Blog updated successfully",
            description: "Your blog has been updated.",
            variant: "default",
          });
          queryClient.invalidateQueries({ queryKey: ["blogs"] });
          reset(values);
          setOpen(false);
        },
        onError: () => {
          toast({
            title: "Error updating blog",
            description: "Failed to update blog",
            variant: "destructive",
          });
        },
      });
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-yellow-500">Edit</p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogDescription>
            Fill out the form and click save to update the blog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Input id="title" {...field} />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Input id="content" {...field} />
              )}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
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
