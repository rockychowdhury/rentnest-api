import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UserRole.TENANT), rentalRequestController.createRentalRequest);
router.get("/my-requests", auth(UserRole.TENANT), rentalRequestController.getMyRentalRequests);
router.get("/incoming-requests", auth(UserRole.LANDLORD), rentalRequestController.getIncomingRentalRequests);
router.get("/:rentalRequestId", auth(UserRole.LANDLORD, UserRole.TENANT), rentalRequestController.getRentalRequestById);
router.patch("/:rentalRequestId/cancel", auth(UserRole.TENANT), rentalRequestController.cancelRentalRequest);
router.patch("/:rentalRequestId/respond", auth(UserRole.LANDLORD), rentalRequestController.respondToRentalRequest);

export const rentalRequestRoutes = router;
