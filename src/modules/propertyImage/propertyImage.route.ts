import { Router } from "express";
import { propertyImageController } from "./propertyImage.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/property/:propertyId", propertyImageController.getImagesByPropertyId);
router.post("/property/:propertyId", auth(UserRole.LANDLORD), propertyImageController.createPropertyImage);
router.patch("/:imageId", auth(UserRole.LANDLORD), propertyImageController.updatePropertyImage);
router.delete("/:imageId", auth(UserRole.LANDLORD), propertyImageController.deletePropertyImage);

export const propertyImageRoutes = router;
