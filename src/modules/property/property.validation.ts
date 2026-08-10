import { z } from 'zod';
import { PropertyStatus } from '../../../generated/prisma/enums';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const addressSchema = z.object({
  buildingNo: z.string().min(1, 'Building number is required').max(255),
  streetAddress: z.string().min(1, 'Street address is required').max(255),
  addressLine2: z.string().optional(),
  landmark: z.string().max(255).optional(),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  areaId: z.number().int().positive('Area ID is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const createPropertySchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Valid Category ID is required'),
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
    address: addressSchema.optional(),
  }).strict(),
});

const updatePropertySchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  }),
  body: z.object({
    categoryId: z.string().uuid().optional(),
    title: z.string().max(255).optional(),
    description: z.string().optional(),
    address: addressSchema.partial().optional(),
  }).strict(),
});

const updatePropertyStatusSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  }),
  body: z.object({
    status: z.literal(PropertyStatus.INACTIVE),
  }).strict(),
});

const requestVerificationSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  })
});

const setPropertyAmenitiesSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Invalid Property ID in URL"),
  }),
  body: z.object({
    amenityIds: z.array(z.string().uuid('Valid Amenity ID is required')),
  }),
});

const getAllPropertiesSchema = z.object({
  query: paginationQuerySchema.extend({
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    amenities: z.string().optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    isFeatured: z.preprocess((val) => val === 'true' || val === '1' || val === true, z.boolean()).optional(),
    timeFilter: z.enum(['today', 'this-month']).optional(),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    rentType: z.string().optional(),
    divisionId: z.string().optional(),
    districtId: z.string().optional(),
    areaId: z.string().optional(),
  }),
});
const getLandlordPropertiesSchema = z.object({
  params: z.object({ landlordId: z.string().uuid("Invalid Landlord ID in URL") }),
  query: paginationQuerySchema
});
const getPropertyByIdSchema = uuidParamSchema('propertyId');

export const PropertyValidation = {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
  requestVerificationSchema,
  setPropertyAmenitiesSchema,
  getAllPropertiesSchema,
  getLandlordPropertiesSchema,
  getPropertyByIdSchema,
};
