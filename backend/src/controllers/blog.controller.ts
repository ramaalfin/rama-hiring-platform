import prisma from "../prisma/client";
import catchErrors from "../utils/catchErros";

export const getBlogsController = catchErrors(async (req, res) => {
  const data = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  return res.status(200).json({
    data,
    message: "Blogs fetched successfully",
  });
});

export const getBlogByIdController = catchErrors(async (req, res) => {
  const { id } = req.params;

  const data = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!data) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res.status(200).json({
    data,
    message: "Blog fetched successfully",
  });
});

export const createBlogController = catchErrors(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      content,
      authorId: userId.toString(),
    },
  });

  return res.status(201).json({
    message: "Blog created successfully",
    data: newBlog,
  });
});

export const deleteBlogController = catchErrors(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.authorId !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this blog" });
  }

  await prisma.blog.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({ message: "Blog deleted successfully" });
});

export const updateBlogController = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.userId;

  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.authorId !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this blog" });
  }

  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });

  return res.status(200).json({
    message: "Blog updated successfully",
    data: updatedBlog,
  });
});
