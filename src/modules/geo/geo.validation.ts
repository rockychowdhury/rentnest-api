import { z } from 'zod';

const getDistrictsByDivisionSchema = z.object({
  params: z.object({ divisionId: z.string().regex(/^\d+$/, "Division ID must be a number") }),
});

const getDistrictByIdSchema = z.object({
  params: z.object({ districtId: z.string().regex(/^\d+$/, "District ID must be a number") }),
});

const getAreasByDistrictSchema = z.object({
  params: z.object({ districtId: z.string().regex(/^\d+$/, "District ID must be a number") }),
});

const getAreaByIdSchema = z.object({
  params: z.object({ areaId: z.string().regex(/^\d+$/, "Area ID must be a number") }),
});

const searchAreasSchema = z.object({
  query: z.object({ q: z.string().min(1, "Search term 'q' is required") }),
});

export const GeoValidation = {
  getDistrictsByDivisionSchema,
  getDistrictByIdSchema,
  getAreasByDistrictSchema,
  getAreaByIdSchema,
  searchAreasSchema
};
