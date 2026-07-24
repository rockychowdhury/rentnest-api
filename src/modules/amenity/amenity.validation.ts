import { z } from 'zod';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const createAmenitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
  }),
});

const updateAmenitySchema = z.object({
  params: z.object({
    amenityId: z.string().uuid("Invalid Amenity ID in URL"),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.string().optional(),
  }),
});

const deleteAmenitySchema = uuidParamSchema('amenityId');
const getAllAmenitiesSchema = z.object({ query: paginationQuerySchema });

export const AmenityValidation = {
  createAmenitySchema,
  updateAmenitySchema,
  deleteAmenitySchema,
  getAllAmenitiesSchema,
};
