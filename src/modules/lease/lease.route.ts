import { Router } from "express";
import { leaseController } from "./lease.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/my-leases", auth(UserRole.TENANT), leaseController.getMyLeases);
router.get("/landlord-leases", auth(UserRole.LANDLORD), leaseController.getLandlordLeases);
router.get("/:leaseId", auth(UserRole.LANDLORD, UserRole.TENANT), leaseController.getLeaseById);
router.patch("/:leaseId/status", auth(UserRole.LANDLORD, UserRole.ADMIN), leaseController.updateLeaseStatus);
router.get("/:leaseId/payments", auth(UserRole.LANDLORD, UserRole.TENANT), leaseController.getLeasePayments);

export const leaseRoutes = router;
