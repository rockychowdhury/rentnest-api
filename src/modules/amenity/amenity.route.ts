import { Router } from "express";
import { amenityController } from "./amenity.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", amenityController.getAllAmenities);
router.post("/", auth(UserRole.ADMIN), amenityController.createAmenity);
router.patch("/:amenityId", auth(UserRole.ADMIN), amenityController.updateAmenity);
router.delete("/:amenityId", auth(UserRole.ADMIN), amenityController.deleteAmenity);

export const amenityRoutes = router;
