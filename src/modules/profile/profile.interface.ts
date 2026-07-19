import { Gender } from "../../../generated/prisma/enums";

export interface IPublicProfile {
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    gender?: Gender;
    occupation?: string;
}

export type IUpdateProfile = Partial<IPublicProfile>