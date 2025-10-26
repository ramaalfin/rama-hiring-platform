import { NOT_FOUND, OK } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErros";
import { getUserService, getAllJobsService } from "../services/user.service";

export const getUserController = catchErrors(async (req, res) => {
  // const user = await UserModel.findById(req.userId);
  // const user = await prisma.user.findUnique({
  //   where: { id: req.userId.toString() },
  //   select: {
  //     id: true,
  //     fullName: true,
  //     email: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });

  try {
    const userId = String(req.userId);
    const user = await getUserService(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in getUserController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const getAllJobsController = catchErrors(async (req, res) => {
  // const jobs = await prisma.job.findMany({
  //   select: {
  //     id: true,
  //     title: true,
  //     description: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });
  try {
    const jobs = await getAllJobsService();
    return res.json({ jobs });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});