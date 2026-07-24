import { z } from 'zod';
import { uuidParamSchema } from '../../middleware/shared.validation';

const createPropertyImageSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  }),
  body: z.object({
    url: z.string().url('A valid URL is required').max(255),
    deleteUrl: z.string().url().max(255).optional(),
    caption: z.string().max(255).optional(),
    isCover: z.boolean().optional(),
  }),
});

const updatePropertyImageSchema = z.object({
  params: z.object({
    imageId: z.string().uuid("Invalid Image ID in URL"),
  }),
  body: z.object({
    caption: z.string().max(255).optional(),
    isCover: z.boolean().optional(),
  }),
});

const getImagesByPropertyIdSchema = uuidParamSchema('propertyId');
const deletePropertyImageSchema = uuidParamSchema('imageId');

export const PropertyImageValidation = {
  createPropertyImageSchema,
  updatePropertyImageSchema,
  getImagesByPropertyIdSchema,
  deletePropertyImageSchema,
};
