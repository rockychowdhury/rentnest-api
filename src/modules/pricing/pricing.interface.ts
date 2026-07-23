import { RentType, Currency } from "../../../generated/prisma/enums";

export interface IPricingCreatePayload {
    rentType: RentType;
    rentAmount: number;
    securityDeposit?: number;
    currency?: Currency;
    isActive?: boolean;
}

export interface IPricingUpdatePayload {
    rentType?: RentType;
    rentAmount?: number;
    securityDeposit?: number;
    currency?: Currency;
    isActive?: boolean;
}
