import { Router } from "express";
import { propertyImageController } from "./propertyImage.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { PropertyImageValidation } from "./propertyImage.validation";

const router = Router();

router.get("/property/:propertyId", validateRequest(PropertyImageValidation.getImagesByPropertyIdSchema), propertyImageController.getImagesByPropertyId);
router.post("/property/:propertyId", auth(UserRole.LANDLORD), validateRequest(PropertyImageValidation.createPropertyImageSchema), propertyImageController.createPropertyImage);
router.patch("/:imageId", auth(UserRole.LANDLORD), validateRequest(PropertyImageValidation.updatePropertyImageSchema), propertyImageController.updatePropertyImage);
router.delete("/:imageId", auth(UserRole.LANDLORD), validateRequest(PropertyImageValidation.deletePropertyImageSchema), propertyImageController.deletePropertyImage);

export const propertyImageRoutes = router;
