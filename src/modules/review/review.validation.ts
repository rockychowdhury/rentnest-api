import { z } from 'zod';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const createReviewSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Valid Property ID is required'),
    leaseId: z.string().uuid('Valid Lease ID is required').optional(),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().optional(),
  }),
});

const updateReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid("Invalid Review ID in URL"),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

const respondToReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid("Invalid Review ID in URL"),
  }),
  body: z.object({
    landlordResponse: z.string().min(1, 'Response is required'),
  }),
});

const getReviewsByPropertyIdSchema = z.object({
  params: z.object({ propertyId: z.string().uuid("Invalid Property ID in URL") }),
  query: paginationQuerySchema
});
const deleteReviewSchema = uuidParamSchema('reviewId');

export const ReviewValidation = {
  createReviewSchema,
  updateReviewSchema,
  respondToReviewSchema,
  getReviewsByPropertyIdSchema,
  deleteReviewSchema,
};
