import { Router } from "express";
import { getAllJobsController, getUserController } from "../controllers/user.controller";
import authenticate from "../middleware/authenticate";
import { authorizeRole } from "../middleware/authorizeRole";

const userRoutes = Router();

userRoutes.get("/", authenticate, getUserController);
userRoutes.get("/jobs", authenticate, authorizeRole(["CANDIDATE", "ADMIN"]), getAllJobsController);

export default userRoutes;
