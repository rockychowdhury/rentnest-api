import { RentType } from "../../../generated/prisma/enums";

export interface IPricingCreatePayload {
    rentType: RentType;
    rentAmount: number;
    securityDeposit?: number;
    currency?: string;
    isActive?: boolean;
}

export interface IPricingUpdatePayload {
    rentType?: RentType;
    rentAmount?: number;
    securityDeposit?: number;
    currency?: string;
    isActive?: boolean;
}