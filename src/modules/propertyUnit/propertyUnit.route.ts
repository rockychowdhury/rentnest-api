import { Router } from "express";
import { propertyUnitController } from "./propertyUnit.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/property/:propertyId", propertyUnitController.getUnitsByPropertyId);
router.get("/:propertyUnitId", propertyUnitController.getPropertyUnitById);
router.post("/property/:propertyId", auth(UserRole.LANDLORD), propertyUnitController.createPropertyUnit);
router.patch("/:propertyUnitId", auth(UserRole.LANDLORD), propertyUnitController.updatePropertyUnit);
router.patch("/:propertyUnitId/status", auth(UserRole.LANDLORD), propertyUnitController.updatePropertyUnitStatus);
router.delete("/:propertyUnitId", auth(UserRole.LANDLORD), propertyUnitController.deletePropertyUnit);
router.get("/:propertyUnitId/availability", propertyUnitController.getPropertyUnitAvailability);

export const propertyUnitRoutes = router;
