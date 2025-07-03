import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/client";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErros";

export const getUserController = catchErrors(async (req, res) => {
  // const user = await UserModel.findById(req.userId);
  const user = await prisma.user.findUnique({
    where: { id: req.userId.toString() },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user);
});
