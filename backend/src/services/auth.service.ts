import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType";
// import SessionModel from "../model/session.model";
// import UserModel from "../model/user.model";
// import VerificationCodeModel from "../model/verification.model";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
} from "../utils/date";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import { refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
// import { sendMail } from "../utils/sendMail";
import {
  sendVerificationEmail,
  sendTwoFACode,
  sendForgotPasswordEmail,
} from "../utils/sendMail";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplate";
import { hashValue } from "../utils/bcrypt";
import prisma from "../prisma/client";
import { comparePassword } from "../utils/password";

type ResetPasswordData = {
  password: string;
  verificationCode: string;
};

export type CreateAccountData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: await hashValue(data.password),
    },
  });

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId: user.id.toString(),
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
      createdAt: new Date(),
    },
  });

  const verifyCode = verificationCode.id;

  await sendVerificationEmail(user.email, verifyCode);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent: data.userAgent,
      expiresAt: oneYearFromNow(),
    },
  });

  const refreshToken = signToken(
    { sessionId: session.id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId: session.id,
    userId: user.id,
  });

  return { user: user, refreshToken, accessToken };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // const user = await UserModel.findOne({ email });
  const user = await prisma.user.findUnique({
    where: { email },
  });
  appAssert(user, NOT_FOUND, "User not found");

  const isPasswordValid = comparePassword(password, user.password);
  appAssert(isPasswordValid, NOT_FOUND, "Invalid password");

  const userId = user.id;
  // const session = await SessionModel.create({ userId, userAgent });
  const session = await prisma.session.create({
    data: {
      userId,
      userAgent,
    },
  });

  const sessionInfo = {
    sessionId: session.id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  return { user, refreshToken, accessToken };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  // const session = await SessionModel.findById(payload.sessionId);
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
  });
  const now = Date.now();
  appAssert(
    // session && session.expiresAt.getTime() > now,
    session && session.expiresAt && session.expiresAt > new Date(now),
    UNAUTHORIZED,
    "Session expired"
  );

  // refresh the session if it expires in 24 hours
  const sessionNeedRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedRefresh) {
    session.expiresAt = oneYearFromNow();
    // await session.save();
  }

  const newRefreshToken = sessionNeedRefresh
    ? signToken({ sessionId: session.id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    sessionId: session.id,
    userId: session.userId,
  });

  return { accessToken, newRefreshToken };
};

export const verifyEmail = async (code: string) => {
  // get verification code
  // const validCode = await VerificationCodeModel.findOne({
  //   id: code,
  //   type: VerificationCodeType.EmailVerification,
  //   expiresAt: { $gt: new Date() },
  // });

  const validCode = await prisma.verificationCode.findUnique({
    where: {
      id: code,
      type: VerificationCodeType.EmailVerification,
      expiresAt: { gt: new Date() },
    },
  });

  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  // update user to verified true
  // const updateUser = await UserModel.findByIdAndUpdate(
  //   validCode.userId,
  //   {
  //     verified: true,
  //   },
  //   { new: true }
  // );

  const updateUser = await prisma.user.update({
    where: { id: validCode.userId },
    data: { verified: true },
  });

  appAssert(updateUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  // delete verif code
  // await validCode.deleteOne();
  await prisma.verificationCode.delete({
    where: { id: validCode.id },
  });

  return {
    user: updateUser,
  };
};

export const forgotPasswordService = async (email: string) => {
  // get the user by email
  // const user = await UserModel.findOne({ email });
  const user = await prisma.user.findUnique({
    where: { email },
  });
  appAssert(user, NOT_FOUND, "User not found");

  // check email rate limit
  const fiveMinAgo = fiveMinutesAgo();
  // const emailCount = await VerificationCodeModel.countDocuments({
  //   userId: user.id,
  //   type: VerificationCodeType.PasswordReset,
  //   createdAt: { $gt: fiveMinAgo },
  // });
  const emailCount = await prisma.verificationCode.count({
    where: {
      userId: user.id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { gt: fiveMinAgo },
    },
  });

  appAssert(
    emailCount <= 3,
    TOO_MANY_REQUESTS,
    "Too many requests, try again later"
  );

  // create verification code
  const expiresAt = oneHourFromNow();
  // const verificationCode = await VerificationCodeModel.create({
  //   userId: user.id,
  //   type: VerificationCodeType.PasswordReset,
  //   expiresAt,
  // });

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId: user.id.toString(),
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
      createdAt: new Date(),
    },
  });

  // send verification email
  const url = `${APP_ORIGIN}/forgot-password?code=${
    verificationCode.id
  }&expiresAt=${expiresAt.getTime()}`;

  await sendForgotPasswordEmail(email, url);

  // return success
  return {
    url,
    // emailId: data.id,
  };
};

// export const resetPassword = async ({
//   password,
//   verificationCode,
// }: ResetPasswordData) => {
//   // get verification code
//   // const validCode = await VerificationCodeModel.findOne({
//   //   id: verificationCode,
//   //   type: VerificationCodeType.PasswordReset,
//   //   expiresAt: { $gt: new Date() },
//   // });

//   const validCode = await prisma.verificationCode.findUnique({
//     where: {
//       id: verificationCode,
//       type: VerificationCodeType.PasswordReset,
//       expiresAt: { gt: new Date() },
//     },
//   });

//   appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

//   // update the user password
//   // const updateUser = await UserModel.findByIdAndUpdate(validCode.userId, {
//   //   password: await hashValue(password),
//   // });

//   const updateUser = await prisma.user.update({
//     where: { id: validCode.userId },
//     data: { password: await hashValue(password) },
//   });

//   appAssert(updateUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

//   // delete verif code
//   await validCode.deleteOne();

//   // delete all user sessions
//   // await SessionModel.deleteMany({ userId: updateUser.id });

//   await prisma.session.deleteMany({
//     where: { userId: updateUser.id },
//   });

//   return {
//     user: updateUser.omitPassword(),
//   };
// };
