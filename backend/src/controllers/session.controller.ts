import { z } from "zod";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import catchErrors from "../utils/catchErros";
import appAssert from "../utils/appAssert";
import { clearAuthCookies } from "../utils/cookies";
import prisma from "../prisma/client";

export const getAllSessionController = catchErrors(async (req, res) => {
  const userId = req.userId;
  const sessionId = req.sessionId;

  // const sessions = await SessionModel.find(
  //   {
  //     userId,
  //     expiresAt: { $gt: new Date() },
  //   },
  //   {
  //     _id: 1,
  //     userId: 1,
  //     userAgent: 1,
  //     expiresAt: 1,
  //     createdAt: 1,
  //   },
  //   {
  //     sort: { createAt: -1 },
  //   }
  // );

  const sessions = await prisma.session.findMany({
    where: {
      userId: userId.toString(),
    },
  });

  // const modifiedSessions = sessions.map((session: any) => {
  //   return {
  //     ...session.toObject(),
  //     ...(session.id === sessionId && { isCurrent: true }),
  //   };
  // });

  const modifiedSessions = sessions.map((session) => {
    return {
      ...session,
      isCurrent: session.id.toString() === sessionId.toString(),
    };
  });

  return res.status(OK).json({
    sessions: modifiedSessions,
  });
});

export const getSessionController = catchErrors(async (req, res) => {
  const sessionId = req?.sessionId;

  appAssert(sessionId, NOT_FOUND, "Session not found");

  // const session = await SessionModel.findById(sessionId)
  //   .populate("userId")
  //   .select("-expiredAt");

  const session = await prisma.session.findUnique({
    where: { id: sessionId.toString() },
    // select: {
    //   id: true,
    //   userId: true,
    //   userAgent: true,
    //   expiresAt: true,
    //   createdAt: true,
    //   user: {
    //     select: {
    //       id: true,
    //       email: true,
    //       fullName: true,
    //     },
    //   },
    // },
  });

  const user = await prisma.user.findUnique({
    where: { id: session?.userId.toString() },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  // clear auth cookie if session is not found
  if (!session) {
    clearAuthCookies(res);
    return res.status(UNAUTHORIZED).json({
      message: "Session not found",
    });
  }

  // const { userId: user } = session;

  return res.status(OK).json({ user });
});

export const deleteSessionController = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);

  // const deleted = await SessionModel.findOneAndDelete({
  //   _id: sessionId,
  //   userId: req.userId,
  // });
  const deleted = await prisma.session.delete({
    where: {
      id: sessionId,
      userId: req.userId.toString(),
    },
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
  return res.status(OK).json({ message: "Session deleted" });
});
