import { z } from 'zod';
import { RentType, Currency, RentalRequestStatus } from '../../../generated/prisma/enums';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const createRentalRequestSchema = z.object({
  body: z.object({
    propertyUnitId: z.string().uuid('Valid Property Unit ID is required'),
    pricingId: z.string().uuid('Valid Pricing ID is required'),
    moveInDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date string" }),
    duration: z.number().int().positive().optional(),
    message: z.string().optional(),
  }),
});

const respondToRentalRequestSchema = z.object({
  params: z.object({
    rentalRequestId: z.string().uuid("Invalid Rental Request ID in URL"),
  }),
  body: z.object({
    status: z.enum([RentalRequestStatus.APPROVED, RentalRequestStatus.REJECTED]),
    landlordResponse: z.string().optional(),
  }),
});

const getMyRentalRequestsSchema = z.object({ query: paginationQuerySchema });
const getIncomingRentalRequestsSchema = z.object({ query: paginationQuerySchema });
const getRentalRequestByIdSchema = uuidParamSchema('rentalRequestId');
const cancelRentalRequestSchema = uuidParamSchema('rentalRequestId');

export const RentalRequestValidation = {
  createRentalRequestSchema,
  respondToRentalRequestSchema,
  getMyRentalRequestsSchema,
  getIncomingRentalRequestsSchema,
  getRentalRequestByIdSchema,
  cancelRentalRequestSchema,
};
