import { Router } from "express";
import { geoController } from "./geo.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/divisions", geoController.getAllDivisions);
router.get("/divisions/:divisionId/districts", geoController.getDistrictsByDivision);
router.get("/districts/:districtId", geoController.getDistrictById);
router.get("/districts/:districtId/upazilas", geoController.getUpazilasByDistrict);
router.get("/upazilas/search", geoController.searchUpazilas);
router.get("/upazilas/:upazilaId", geoController.getUpazilaById);

router.post("/divisions", auth(UserRole.ADMIN), geoController.createDivision);
router.post("/districts", auth(UserRole.ADMIN), geoController.createDistrict);
router.post("/upazilas", auth(UserRole.ADMIN), geoController.createUpazila);

export const geoRoutes = router;
