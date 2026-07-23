import { Currency } from "../../../generated/prisma/enums"

export interface IPaymentInitiatePayload {
  tenantId: string;
  leaseId: string;
  landlordId: string;
  amount: number;
  currency: Currency;
  stripeCustomerId: string;
}
