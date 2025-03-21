import { Router } from "express";
import { getUserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", getUserController);

export default userRoutes;
