
export interface IUserRegisterPayload {
    email: string;
    phone: string;
    password: string;
    fullName: string;
}

export type ILoginPayload = Pick<IUserRegisterPayload, "email" | "password">;

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export type IUpdateUserPayload = Partial<Pick<IUserRegisterPayload, "email" | "phone">>;


