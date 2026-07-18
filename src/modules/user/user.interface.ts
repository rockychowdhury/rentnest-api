import { UserRole } from "../../../generated/prisma/enums";



export interface IUserRegisterPayload {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    role: UserRole
}



export type IUpdateUserPayload = Partial<Pick<IUserRegisterPayload, "email" | "phone">>;


