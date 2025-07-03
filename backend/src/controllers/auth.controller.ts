import { z } from "zod";
import catchErrors from "../utils/catchErros";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmail,
  // resetPassword,
  // sendPasswordResetEmail,
  // verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationEmailSchema,
} from "../schemas/auth.schemas";
import { verifyToken } from "../utils/jwt";
// import SessionModel from "../model/session.model";
import appAssert from "../utils/appAssert";
import prisma from "../prisma/client";

export const registerController = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, refreshToken } = await createAccount(request);

  setAuthCookies({ res, accessToken, refreshToken });
  return res.status(CREATED).json({
    message: "Account created successfully",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  });
});

export const loginController = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken } = await loginUser(request);

  setAuthCookies({ res, accessToken, refreshToken });
  return res.status(OK).json({
    message: "Login successful",
  });
});

export const logoutController = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    // await SessionModel.deleteOne({
    //   _id: payload.sessionId,
    //   userId: payload.userId,
    // });

    await prisma.session.deleteMany({
      where: {
        id: payload.sessionId,
        userId: payload.userId,
      },
    });
  }

  clearAuthCookies(res);
  return res.status(OK).json({
    message: "Logout successful",
  });
});

export const refreshController = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access Token refreshed",
    });
});

export const verifyEmailController = catchErrors(async (req, res) => {
  const { code } = verificationEmailSchema.parse(req.body);

  await verifyEmail(code);

  return res.status(OK).json({
    message: "Email was successfully verify",
  });
});

// export const sendPasswordResetController = catchErrors(async (req, res) => {
//   const email = emailSchema.parse(req.body.email);

//   // call service
//   await sendPasswordResetEmail(email);

//   return res.status(OK).json({
//     message: "Password reset email sent",
//   });
// });

// export const resetPasswordController = catchErrors(async (req, res) => {
//   const request = resetPasswordSchema.parse(req.body);

//   // call service
//   await resetPassword(request);

//   clearAuthCookies(res);
//   return res.status(OK).json({
//     message: "Password reset successful",
//   });
// });
