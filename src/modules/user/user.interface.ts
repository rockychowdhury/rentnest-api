
export interface IUserRegisterPayload {
    email: string;
    phone: string;
    password: string;
    fullName: string;
}



export type IUpdateUserPayload = Partial<Pick<IUserRegisterPayload, "email" | "phone">>;


