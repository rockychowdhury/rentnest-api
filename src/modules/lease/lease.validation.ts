import { z } from 'zod';
import { LeaseStatus } from '../../../generated/prisma/enums';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const updateLeaseStatusSchema = z.object({
  params: z.object({
    leaseId: z.string().uuid("Invalid Lease ID in URL"),
  }),
  body: z.object({
    status: z.nativeEnum(LeaseStatus),
  }),
});

const getMyLeasesSchema = z.object({ query: paginationQuerySchema });
const getLandlordLeasesSchema = z.object({ query: paginationQuerySchema });
const getLeaseByIdSchema = uuidParamSchema('leaseId');
const getLeasePaymentsSchema = uuidParamSchema('leaseId');

export const LeaseValidation = {
  updateLeaseStatusSchema,
  getMyLeasesSchema,
  getLandlordLeasesSchema,
  getLeaseByIdSchema,
  getLeasePaymentsSchema,
};
