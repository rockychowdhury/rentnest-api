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
router.get("/districts/:districtId/areas", validateRequest(GeoValidation.getAreasByDistrictSchema), geoController.getAreasByDistrict);
router.get("/areas/search", validateRequest(GeoValidation.searchAreasSchema), geoController.searchAreas);
router.get("/areas/:areaId", validateRequest(GeoValidation.getAreaByIdSchema), geoController.getAreaById);

export const geoRoutes = router;
