import { IUserRegisterPayload } from "../user/user.interface";

export type ILoginPayload = Pick<IUserRegisterPayload, "email" | "password">;

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}