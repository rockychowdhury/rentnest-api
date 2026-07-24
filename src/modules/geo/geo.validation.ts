import { z } from 'zod';

const getDistrictsByDivisionSchema = z.object({
  params: z.object({ divisionId: z.string().regex(/^\d+$/, "Division ID must be a number") }),
});

const getDistrictByIdSchema = z.object({
  params: z.object({ districtId: z.string().regex(/^\d+$/, "District ID must be a number") }),
});

const getUpazilasByDistrictSchema = z.object({
  params: z.object({ districtId: z.string().regex(/^\d+$/, "District ID must be a number") }),
});

const getUpazilaByIdSchema = z.object({
  params: z.object({ upazilaId: z.string().regex(/^\d+$/, "Upazila ID must be a number") }),
});

const searchUpazilasSchema = z.object({
  query: z.object({ q: z.string().min(1, "Search term 'q' is required") }),
});

const createGeoSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
  })
});

const createUpazilaSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    districtId: z.number().int().positive(),
  })
});

export const GeoValidation = {
  getDistrictsByDivisionSchema,
  getDistrictByIdSchema,
  getUpazilasByDistrictSchema,
  getUpazilaByIdSchema,
  searchUpazilasSchema,
  createGeoSchema,
  createUpazilaSchema
};
