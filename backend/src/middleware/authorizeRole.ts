import { RequestHandler } from "express";
import prisma from "../prisma/client";
import authenticate from "./authenticate";

export const authorizeRole = (roles: string[]): RequestHandler => {
    return async (req, res, next) => {
        await authenticate(req, res, async () => {
            const user = await prisma.user.findUnique({
                where: { id: String(req.userId) },
            });
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        });
    };
};
