import { z } from 'zod';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';
import { AmenityType } from '../../../generated/prisma/enums';

const createAmenitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    type: z.nativeEnum(AmenityType).optional(),
  }),
});

const updateAmenitySchema = z.object({
  params: z.object({
    amenityId: z.string().uuid("Invalid Amenity ID in URL"),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.string().optional(),
    type: z.nativeEnum(AmenityType).optional(),
  }),
});

const deleteAmenitySchema = uuidParamSchema('amenityId');
const getAllAmenitiesSchema = z.object({ 
  query: paginationQuerySchema.extend({
    type: z.string().optional() // Comma-separated string of AmenityTypes
  }) 
});

export const AmenityValidation = {
  createAmenitySchema,
  updateAmenitySchema,
  deleteAmenitySchema,
  getAllAmenitiesSchema,
};
