import { Router } from "express";
import { amenityController } from "./amenity.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { AmenityValidation } from "./amenity.validation";

const router = Router();

router.get("/", validateRequest(AmenityValidation.getAllAmenitiesSchema), amenityController.getAllAmenities);
router.post("/", auth(UserRole.ADMIN), validateRequest(AmenityValidation.createAmenitySchema), amenityController.createAmenity);
router.patch("/:amenityId", auth(UserRole.ADMIN), validateRequest(AmenityValidation.updateAmenitySchema), amenityController.updateAmenity);
router.delete("/:amenityId", auth(UserRole.ADMIN), validateRequest(AmenityValidation.deleteAmenitySchema), amenityController.deleteAmenity);

export const amenityRoutes = router;
