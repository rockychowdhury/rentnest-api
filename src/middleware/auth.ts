import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";





declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}


export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1] :
                req.headers.authorization;
        // console.log("Authenticating user ", token);
        if (!token) {
            throw new Error("You are not Logged in.");
        }

        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifyToken.success) {
            throw new Error(verifyToken.error);
        }
        // console.log("User Authenticating ", verifyToken);
        const { email, name, role, id } = verifyToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this resources");
        }

        const user = await prisma.user.findUnique(
            {
                where: { id, email, role }
            }
        );

        if (!user) {
            throw new Error("User does not exist");
        }

        if (user.activeStatus === "BLOCKED") {
            throw new Error("You are blocked! Please contact support");
        }

        req.user = {
            email, name, id, role
        }
        next();

    });
}