import prisma from "../prisma/client";

export const getUserService = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            verified: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const getAllJobsService = async () => {
    return prisma.job.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            creator: {
                select: { fullName: true, role: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
