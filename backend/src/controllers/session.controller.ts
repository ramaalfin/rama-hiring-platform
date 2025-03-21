import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../model/session.model";
import catchErrors from "../utils/catchErros";
import appAssert from "../utils/appAssert";
import { clearAuthCookies } from "../utils/cookies";

export const getAllSessionController = catchErrors(async (req, res) => {
  const userId = req.userId;
  const sessionId = req.sessionId;

  const sessions = await SessionModel.find(
    {
      userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userId: 1,
      userAgent: 1,
      expiresAt: 1,
      createdAt: 1,
    },
    {
      sort: { createAt: -1 },
    }
  );

  const modifiedSessions = sessions.map((session) => {
    return {
      ...session.toObject(),
      ...(session.id === sessionId && { current: true }),
    };
  });

  return res.status(OK).json({
    sessions: modifiedSessions,
  });
});

export const getSessionController = catchErrors(async (req, res) => {
  const sessionId = req?.sessionId;

  appAssert(sessionId, NOT_FOUND, "Session not found");

  const session = await SessionModel.findById(sessionId)
    .populate("userId")
    .select("-expiredAt");

  // clear auth cookie if session is not found
  if (!session) {
    return clearAuthCookies(res);
  }

  const { userId: user } = session;

  return res.status(OK).json({ user });
});

export const deleteSessionController = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
  return res.status(OK).json({ message: "Session deleted" });
});
