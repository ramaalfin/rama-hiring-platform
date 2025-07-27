import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blog";

export default function DeleteDialog({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { refetch } = useBlogs();

  const { mutate: deleteBlog, isPending } = useMutation({
    mutationFn: (id: string) => deleteBlogMutationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast({
        title: "Blog deleted successfully",
        description: "Your blog has been deleted.",
        variant: "default",
      });
      refetch();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error deleting blog",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    },
  });

  if (!id) return null;

  return (
    <Dialog open={!!id} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => deleteBlog(id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}