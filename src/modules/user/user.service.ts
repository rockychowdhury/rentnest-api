import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma";
import { IUpdateUserPayload, IUserRegisterPayload } from "./user.interface"
import config from "../../config";

const createUser = async (payload: IUserRegisterPayload) => {
    const { email, fullName, phone, password, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserExist) {
        throw new Error("User with this email already exist");
    }
    if(role === UserRole.ADMIN){
        throw new Error("Bad Request. Client Error")
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const response = await prisma.user.create(
        {
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
        }
    );

    const user = prisma.user.findUnique(
        {
            where: {
                id: response.id,
                email: response.email || email
            },
            omit: {
                passwordHashed: true
            },
            include: {
                profile: true,
            }
        }
    );
    return user;

}


const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}


const getUserById = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    return user;
}

const updateUserStatusById = async (payload: { status: UserStatus }, userId: string) => {
    const result = await prisma.user.update(
        {
            where: {
                id: userId
            },
            data: {
                status: payload.status
            },
            include: {
                profile: true
            },
            omit: {
                passwordHashed: true
            }
        }
    );
    return result;
}

const deleteMyAccount = async (userId: string) => {
    const user = await prisma.user.update(
        {
            where: { id: userId },
            data: {
                deletedAt: new Date(),
                status: UserStatus.SUSPENDED
            },
            omit: {
                passwordHashed: true,
            },

        }
    );
    return user;
}

const restoreUserAccount = async (email:{email:string} ) => {
    // console.log(email);
    const user = await prisma.user.update(
        {
            where: email,
            data: {
                deletedAt: null,
                status: UserStatus.ACTIVE
            },
            omit: {
                passwordHashed: true,
            },
            include: {
                profile: true
            }
        }
    );
    return user;
}

const updateMyAccount = async (payload: IUpdateUserPayload, userId: string) => {
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: payload,
        include: {
            profile: true
        },
        omit: { passwordHashed: true }
    });
    return user;
}

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow(
        {
            where: {
                id: userId
            },
            omit: {
                passwordHashed: true
            },
            include: {
                profile: true
            }
        }
    );
    return user;
}

export const userService = {
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUserStatusById,
    updateMyAccount,
    deleteMyAccount,
    createUser,
    restoreUserAccount
}