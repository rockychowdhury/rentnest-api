import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { RentalRequestValidation } from "./rentalRequest.validation";

const router = Router();

router.post("/", auth(UserRole.TENANT), validateRequest(RentalRequestValidation.createRentalRequestSchema), rentalRequestController.createRentalRequest);
router.get("/", auth(UserRole.ADMIN), validateRequest(RentalRequestValidation.getMyRentalRequestsSchema), rentalRequestController.getAllRentalRequests);
router.get("/my-requests", auth(UserRole.TENANT), validateRequest(RentalRequestValidation.getMyRentalRequestsSchema), rentalRequestController.getMyRentalRequests);
router.get("/incoming-requests", auth(UserRole.LANDLORD), validateRequest(RentalRequestValidation.getIncomingRentalRequestsSchema), rentalRequestController.getIncomingRentalRequests);
router.get("/:rentalRequestId", auth(UserRole.LANDLORD, UserRole.TENANT, UserRole.ADMIN), validateRequest(RentalRequestValidation.getRentalRequestByIdSchema), rentalRequestController.getRentalRequestById);
router.patch("/:rentalRequestId/cancel", auth(UserRole.TENANT, UserRole.ADMIN), validateRequest(RentalRequestValidation.cancelRentalRequestSchema), rentalRequestController.cancelRentalRequest);
router.patch("/:rentalRequestId/respond", auth(UserRole.LANDLORD), validateRequest(RentalRequestValidation.respondToRentalRequestSchema), rentalRequestController.respondToRentalRequest);

export const rentalRequestRoutes = router;
