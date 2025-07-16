import { Router } from "express";
import {
  createBlogController,
  deleteBlogController,
  getBlogByIdController,
  getBlogsController,
  updateBlogController,
} from "../controllers/blog.controller";

const blogRoutes = Router();

blogRoutes.get("/", getBlogsController);
blogRoutes.post("/", createBlogController);
blogRoutes.get("/:id", getBlogByIdController);
blogRoutes.delete("/:id", deleteBlogController);
blogRoutes.put("/:id", updateBlogController);

export default blogRoutes;
