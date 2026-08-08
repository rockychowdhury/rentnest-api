import { Router } from "express";
import { propertyUnitController } from "./propertyUnit.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { PropertyUnitValidation } from "./propertyUnit.validation";

const router = Router();

router.get("/property/:propertyId", validateRequest(PropertyUnitValidation.getUnitsByPropertyIdSchema), propertyUnitController.getUnitsByPropertyId);
router.get("/:propertyUnitId", validateRequest(PropertyUnitValidation.getPropertyUnitByIdSchema), propertyUnitController.getPropertyUnitById);
router.post("/property/:propertyId", auth(UserRole.LANDLORD), validateRequest(PropertyUnitValidation.createPropertyUnitSchema), propertyUnitController.createPropertyUnit);
router.patch("/:propertyUnitId", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyUnitValidation.updatePropertyUnitSchema), propertyUnitController.updatePropertyUnit);
router.patch("/:propertyUnitId/status", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyUnitValidation.updatePropertyUnitStatusSchema), propertyUnitController.updatePropertyUnitStatus);
router.patch("/:propertyUnitId/amenities", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyUnitValidation.setUnitAmenitiesSchema), propertyUnitController.setUnitAmenities);
router.delete("/:propertyUnitId", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyUnitValidation.getPropertyUnitByIdSchema), propertyUnitController.deletePropertyUnit);
router.get("/:propertyUnitId/availability", validateRequest(PropertyUnitValidation.getPropertyUnitByIdSchema), propertyUnitController.getPropertyUnitAvailability);

export const propertyUnitRoutes = router;
