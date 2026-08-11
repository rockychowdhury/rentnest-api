import { z } from 'zod';
import { RentType, Currency } from '../../../generated/prisma/enums';
import { uuidParamSchema } from '../../middleware/shared.validation';

const createPricingSchema = z.object({
  params: z.object({
    unitId: z.string().uuid("Invalid Unit ID in URL"),
  }),
  body: z.object({
    rentType: z.nativeEnum(RentType),
    rentAmount: z.number().positive('Rent amount must be a positive number'),
    securityDeposit: z.number().min(0).optional(),
    utilityBill: z.number().min(0).optional(),
    utilityPolicy: z.string().max(255).optional(),
    currency: z.nativeEnum(Currency).optional(),
    isActive: z.boolean().optional(),
  }),
});

const updatePricingSchema = z.object({
  params: z.object({
    pricingId: z.string().uuid("Invalid Pricing ID in URL"),
  }),
  body: z.object({
    rentAmount: z.number().positive().optional(),
    securityDeposit: z.number().min(0).optional(),
    utilityBill: z.number().min(0).optional(),
    utilityPolicy: z.string().max(255).optional(),
    isActive: z.boolean().optional(),
  }),
});

const getPricingByUnitIdSchema = uuidParamSchema('unitId');
const deletePricingSchema = uuidParamSchema('pricingId');

export const PricingValidation = {
  createPricingSchema,
  updatePricingSchema,
  getPricingByUnitIdSchema,
  deletePricingSchema,
};
