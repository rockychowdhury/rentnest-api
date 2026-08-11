import { z } from 'zod';
import { PropertyUnitStatus } from '../../../generated/prisma/enums';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const dateString = z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date string" });

const createPropertyUnitSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  }),
  body: z.object({
    unitLabel: z.string().min(1, 'Unit label is required').max(255),
    status: z.nativeEnum(PropertyUnitStatus).optional(),
    sizeSqft: z.number().int().positive().optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    floor: z.number().int().optional(),
    description: z.string().optional(),
    availableFrom: dateString.optional(),
  }),
});

const updatePropertyUnitSchema = z.object({
  params: z.object({
    propertyUnitId: z.string().uuid("Invalid Property Unit ID in URL"),
  }),
  body: z.object({
    unitLabel: z.string().max(255).optional(),
    sizeSqft: z.number().int().positive().optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    floor: z.number().int().optional(),
    description: z.string().optional(),
    availableFrom: dateString.nullable().optional(),
  }),
});

const updatePropertyUnitStatusSchema = z.object({
  params: z.object({
    propertyUnitId: z.string().uuid("Invalid Property Unit ID in URL"),
  }),
  body: z.object({
    status: z.nativeEnum(PropertyUnitStatus),
  }),
});

const getUnitsByPropertyIdSchema = z.object({
  params: z.object({ propertyId: z.string().uuid("Invalid Property ID in URL") }),
  query: paginationQuerySchema
});
const getPropertyUnitByIdSchema = uuidParamSchema('propertyUnitId');

const setUnitAmenitiesSchema = z.object({
  params: z.object({
    propertyUnitId: z.string().uuid("Invalid Property Unit ID in URL"),
  }),
  body: z.object({
    amenityIds: z.array(z.string().uuid('Valid Amenity ID is required')),
  }).strict(),
});

export const PropertyUnitValidation = {
  createPropertyUnitSchema,
  updatePropertyUnitSchema,
  updatePropertyUnitStatusSchema,
  getUnitsByPropertyIdSchema,
  getPropertyUnitByIdSchema,
  setUnitAmenitiesSchema,
};
