import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IUpdateUserPayload, IUserRegisterPayload } from "./user.interface";
import config from "../../config";
import { UserSelect } from "../../../generated/prisma/models";

const userSelect: UserSelect = {
    id: true,
    email: true,
    phone: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    profile: {
        select: {
            id: true,
            userId: true,
            fullName: true,
            bio: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true
        }
    }
};

const createUser = async (payload: IUserRegisterPayload) => {
    const { email, fullName, phone, password, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    });

    if (isUserExist) {
        throw new Error("User with this email already exist");
    }
    if(role === UserRole.ADMIN){
        throw new Error("Bad Request. Client Error")
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const response = await prisma.user.create({
        data: {
            email,
            phone,
            passwordHashed: hashedPassword,
            role,
            profile: {
                create: {
                    fullName
                }
            }
        }
    });

    const user = await prisma.user.findUnique({
        where: { id: response.id },
        select: userSelect
    });
    return user;
};


const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: userSelect
    });
    return users;
};


const getUserById = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: userSelect
    });
    return user;
};

const updateUserStatusById = async (payload: { status: UserStatus }, userId: string) => {
    const result = await prisma.user.update({
        where: { id: userId },
        data: { status: payload.status },
        select: userSelect
    });
    return result;
};

const deleteMyAccount = async (userId: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            deletedAt: new Date(),
            status: UserStatus.SUSPENDED
        },
        select: userSelect
    });
    return user;
};

const restoreUserAccount = async (email: { email: string }) => {
    const user = await prisma.user.update({
        where: email,
        data: {
            deletedAt: null,
            status: UserStatus.ACTIVE
        },
        select: userSelect
    });
    return user;
};

const updateMyAccount = async (payload: IUpdateUserPayload, userId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    const user = await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: userSelect
    });
    return user;
};

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: userSelect
    });
    return user;
};

export const userService = {
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUserStatusById,
    updateMyAccount,
    deleteMyAccount,
    createUser,
    restoreUserAccount
};