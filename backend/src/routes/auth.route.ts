import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/logout", logoutController);
authRoutes.get("/refresh", refreshController);
authRoutes.post("/email/verify", verifyEmailController);
authRoutes.post("/password/forgot", forgotPasswordController);
authRoutes.post("/password/reset", resetPasswordController);
export default authRoutes;
