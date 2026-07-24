import { Router } from "express";
import { leaseController } from "./lease.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { LeaseValidation } from "./lease.validation";

const router = Router();

router.get("/my-leases", auth(UserRole.TENANT), validateRequest(LeaseValidation.getMyLeasesSchema), leaseController.getMyLeases);
router.get("/landlord-leases", auth(UserRole.LANDLORD), validateRequest(LeaseValidation.getLandlordLeasesSchema), leaseController.getLandlordLeases);
router.get("/:leaseId", auth(UserRole.LANDLORD, UserRole.TENANT), validateRequest(LeaseValidation.getLeaseByIdSchema), leaseController.getLeaseById);
router.patch("/:leaseId/status", auth(UserRole.LANDLORD, UserRole.ADMIN), validateRequest(LeaseValidation.updateLeaseStatusSchema), leaseController.updateLeaseStatus);
router.get("/:leaseId/payments", auth(UserRole.LANDLORD, UserRole.TENANT), validateRequest(LeaseValidation.getLeasePaymentsSchema), leaseController.getLeasePayments);

export const leaseRoutes = router;
