import { RentalRequestStatus } from "../../../generated/prisma/enums";

export interface IRentalRequestCreatePayload {
    propertyUnitId: string;
    pricingId: string;
    moveInDate: Date | string;
    duration?: number;
    message?: string;
}

export interface IRentalRequestRespondPayload {
    status: 'APPROVED' | 'REJECTED';
    landlordResponse?: string;
}