import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.get("/admin/all", auth(UserRole.ADMIN), reviewController.getAllReviewsAdmin);
router.get("/property/:propertyId", validateRequest(ReviewValidation.getReviewsByPropertyIdSchema), reviewController.getReviewsByPropertyId);
router.get("/landlord-reviews", auth(UserRole.LANDLORD), reviewController.getReviewsForLandlord);
router.get("/my-reviews", auth(UserRole.TENANT), reviewController.getMyReviews);
router.post("/", auth(UserRole.TENANT), validateRequest(ReviewValidation.createReviewSchema), reviewController.createReview);
router.patch("/:reviewId", auth(UserRole.TENANT), validateRequest(ReviewValidation.updateReviewSchema), reviewController.updateReview);
router.delete("/:reviewId", auth(UserRole.TENANT, UserRole.ADMIN), validateRequest(ReviewValidation.deleteReviewSchema), reviewController.deleteReview);
router.patch("/:reviewId/respond", auth(UserRole.LANDLORD), validateRequest(ReviewValidation.respondToReviewSchema), reviewController.respondToReview);

export const reviewRoutes = router;
