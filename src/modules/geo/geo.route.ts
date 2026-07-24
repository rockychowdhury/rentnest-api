import { Router } from "express";
import { geoController } from "./geo.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { GeoValidation } from "./geo.validation";

const router = Router();

router.get("/divisions", geoController.getAllDivisions);
router.get("/divisions/:divisionId/districts", validateRequest(GeoValidation.getDistrictsByDivisionSchema), geoController.getDistrictsByDivision);
router.get("/districts/:districtId", validateRequest(GeoValidation.getDistrictByIdSchema), geoController.getDistrictById);
router.get("/districts/:districtId/upazilas", validateRequest(GeoValidation.getUpazilasByDistrictSchema), geoController.getUpazilasByDistrict);
router.get("/upazilas/search", validateRequest(GeoValidation.searchUpazilasSchema), geoController.searchUpazilas);
router.get("/upazilas/:upazilaId", validateRequest(GeoValidation.getUpazilaByIdSchema), geoController.getUpazilaById);

export const geoRoutes = router;
