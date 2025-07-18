import { useState } from "react";
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
import { useDeleteBlog } from "@/hooks/use-blog";
import { toast } from "@/hooks/use-toast";
import { revalidateTag } from "next/cache";

export default function DeleteModal({ id }: any) {
  const [open, setOpen] = useState(false);

  const {
    mutate: deleteBlog,
    isPending,
  } = useDeleteBlog(id);

  const handleDelete = () => {
    deleteBlog(id, {
      onSuccess: () => {
        toast({
          title: "Blog deleted successfully",
          description: "Your blog has been deleted.",
          variant: "default",
        });
        setOpen(false);
        revalidateTag("blogs");
      },
      onError: () => {
        toast({
          title: "Error deleting blog",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-red-500">Delete</p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} onClick={handleDelete}>
            {isPending ? "Saving..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}