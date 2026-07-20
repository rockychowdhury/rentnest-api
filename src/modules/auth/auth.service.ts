import bcrypt from "bcryptjs";
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IChangePasswordPayload, ILoginPayload } from "./auth.interface"
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";


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

const tokenRefresh = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error);
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    });
    if (user.status !== "ACTIVE") {
        throw new Error("You are no longer available in service. Please contact support");
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)

    return { accessToken };
}


const changeMyPassword = async (payload: IChangePasswordPayload, userId: string) => {
    const { currentPassword, newPassword } = payload;

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.passwordHashed);

    if (!isPasswordCorrect) {
        throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
    await prisma.user.update({
        where:{id:user.id},
        data:{
            passwordHashed:hashedPassword
        }
    });
    return null;
}

export const authService = {
    login,
    tokenRefresh,
    changeMyPassword
}
