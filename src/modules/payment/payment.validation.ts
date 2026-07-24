import { z } from 'zod';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const initiatePaymentSchema = z.object({
  params: z.object({
    leaseId: z.string().uuid("Invalid Lease ID in URL"),
  }),
});

const getMyPaymentsSchema = z.object({ query: paginationQuerySchema });
const getLandlordPaymentsSchema = z.object({ query: paginationQuerySchema });
const getPaymentByIdSchema = uuidParamSchema('paymentId');

export const PaymentValidation = {
  initiatePaymentSchema,
  getMyPaymentsSchema,
  getLandlordPaymentsSchema,
  getPaymentByIdSchema,
};
