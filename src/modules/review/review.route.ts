import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/property/:propertyId", reviewController.getReviewsByPropertyId);
router.post("/", auth(UserRole.TENANT), reviewController.createReview);
router.patch("/:reviewId", auth(UserRole.TENANT), reviewController.updateReview);
router.delete("/:reviewId", auth(UserRole.TENANT, UserRole.ADMIN), reviewController.deleteReview);
router.patch("/:reviewId/respond", auth(UserRole.LANDLORD), reviewController.respondToReview);

export const reviewRoutes = router;
