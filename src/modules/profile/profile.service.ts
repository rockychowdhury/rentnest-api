import { prisma } from "../../lib/prisma";
import { IUpdateProfile } from "./profile.interface";


const getProfileById = async (userId: string) => {
    const publicProfile = await prisma.profile.findUniqueOrThrow(
        {
            where: {
                userId
            },
            select: {
                id: true,
                fullName: true,
                occupation: true,
                gender: true,
                bio: true,
                avatarUrl: true,
            }
        }
    );
    return publicProfile;
}

const updateMyProfile = async (payload: IUpdateProfile, userId: string) => {
    const profile = await prisma.profile.findUniqueOrThrow(
        {
            where: { userId }
        }
    );
    const updatedProfile = await prisma.profile.update(
        {
            where: { id: profile.id },
            data: payload,
            select: {
                id: true,
                fullName: true,
                occupation: true,
                gender: true,
                bio: true,
                avatarUrl: true,
            }
        }
    );
    return updatedProfile;
}

export const profileService = {
    getProfileById,
    updateMyProfile
};