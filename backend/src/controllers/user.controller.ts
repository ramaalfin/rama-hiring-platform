import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../model/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErros";

export const getUserController = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user.omitPassword());
});
