import { z } from 'zod';

export const paginationQuerySchema = z.object({
  searchTerm: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

export const uuidParamSchema = (paramName: string) => {
  return z.object({
    [paramName]: z.string().uuid(`Invalid ${paramName} in URL`),
  });
};
