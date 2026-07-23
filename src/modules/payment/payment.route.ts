import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/checkout/lease/:leaseId", auth(UserRole.TENANT), paymentController.initiatePayment); // payment url return -> redirect to payment page
router.post("/webhook", paymentController.stripeWebhook);
router.get("/my-payments", auth(UserRole.TENANT), paymentController.getMyPayments);
router.get("/landlord-payments", auth(UserRole.LANDLORD), paymentController.getLandlordPayments);
router.get("/:paymentId", auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;
