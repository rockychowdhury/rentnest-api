import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { PropertyValidation } from "./property.validation";

const router = Router();

router.get("/", validateRequest(PropertyValidation.getAllPropertiesSchema), propertyController.getAllProperties);
router.get("/admin/all", auth(UserRole.ADMIN), propertyController.getAllPropertiesAdmin);
router.get("/admin/verification-queue", auth(UserRole.ADMIN), propertyController.getVerificationQueue);
router.get("/featured", propertyController.getFeaturedProperties);
router.get("/landlord/:landlordId", validateRequest(PropertyValidation.getLandlordPropertiesSchema), propertyController.getLandlordProperties);
router.get("/my-properties", auth(UserRole.LANDLORD), validateRequest(PropertyValidation.getAllPropertiesSchema), propertyController.getMyProperties);
router.get("/:propertyId", validateRequest(PropertyValidation.getPropertyByIdSchema), propertyController.getPropertyById);
router.post("/", auth(UserRole.LANDLORD), validateRequest(PropertyValidation.createPropertySchema), propertyController.createProperty);
router.patch("/:propertyId", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyValidation.updatePropertySchema), propertyController.updateProperty);
router.patch("/:propertyId/status", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyValidation.updatePropertyStatusSchema), propertyController.updatePropertyStatus);
router.patch("/:propertyId/amenities", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyValidation.setPropertyAmenitiesSchema), propertyController.setPropertyAmenities);
router.delete("/:propertyId", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyValidation.getPropertyByIdSchema), propertyController.deleteProperty);
router.post("/:propertyId/restore", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(PropertyValidation.getPropertyByIdSchema), propertyController.restoreProperty);
router.post("/:propertyId/request-verification", auth(UserRole.LANDLORD), validateRequest(PropertyValidation.requestVerificationSchema), propertyController.requestVerification);
router.patch("/:propertyId/verify", auth(UserRole.ADMIN), validateRequest(PropertyValidation.getPropertyByIdSchema), propertyController.verifyProperty);
router.patch("/:propertyId/reject", auth(UserRole.ADMIN), validateRequest(PropertyValidation.getPropertyByIdSchema), propertyController.rejectProperty);

export const propertyRoutes = router;
