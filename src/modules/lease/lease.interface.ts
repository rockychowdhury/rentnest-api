import { LeaseStatus } from "../../../generated/prisma/enums";

export interface ILeaseUpdateStatusPayload {
    status: LeaseStatus;
}
