import { z } from 'zod';
import { uuidParamSchema, paginationQuerySchema } from '../../middleware/shared.validation';

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().uuid("Invalid Category ID in URL"),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.string().optional(),
  }),
});

const getCategoryByIdSchema = uuidParamSchema('categoryId');
const deleteCategorySchema = uuidParamSchema('categoryId');
const getAllCategoriesSchema = z.object({ query: paginationQuerySchema });

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
  getAllCategoriesSchema,
};
