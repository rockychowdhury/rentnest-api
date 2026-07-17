import bcrypt from "bcryptjs";
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ILoginPayload } from "./auth.interface"
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";


const login = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow(
        {
            where: {
                email
            }
        }
    );

    if (user.deletedAt) {
        throw new Error("Your account is deleted. Please restore your account or contract support");
    }
    if (user.status !== UserStatus.ACTIVE) {
        throw new Error("You are no longer available in service. Please contract support");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.passwordHashed);

    if (!isPasswordMatched) {
        throw new Error("Invalid Credentials Provided");
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    }
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return { accessToken, refreshToken };
}
const logout = async () => {

}
const tokenRefresh = async () => {

}
const changeUserPassword = async () => {

}

export const authService = {
    login,
    logout,
    tokenRefresh,
    changeUserPassword
}