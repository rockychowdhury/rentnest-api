import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", propertyController.getAllProperties);
router.get("/featured", propertyController.getFeaturedProperties);
router.get("/landlord/:landlordId", propertyController.getLandlordProperties);
router.get("/my-properties", auth(UserRole.LANDLORD), propertyController.getMyProperties);
router.get("/:propertyId", propertyController.getPropertyById);
router.post("/", auth(UserRole.LANDLORD), propertyController.createProperty);
router.patch("/:propertyId", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.updateProperty);
router.patch("/:propertyId/status", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.updatePropertyStatus);
router.patch("/:propertyId/amenities", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.setPropertyAmenities);
router.delete("/:propertyId", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.deleteProperty);
router.post("/:propertyId/restore", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.restoreProperty);

export const propertyRoutes = router;
