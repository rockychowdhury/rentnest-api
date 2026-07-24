import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router.post("/checkout/lease/:leaseId", auth(UserRole.TENANT), validateRequest(PaymentValidation.initiatePaymentSchema), paymentController.initiatePayment);
router.post("/webhook", paymentController.stripeWebhook);
router.get("/my-payments", auth(UserRole.TENANT), validateRequest(PaymentValidation.getMyPaymentsSchema), paymentController.getMyPayments);
router.get("/landlord-payments", auth(UserRole.LANDLORD), validateRequest(PaymentValidation.getLandlordPaymentsSchema), paymentController.getLandlordPayments);
router.get("/:paymentId", auth(UserRole.LANDLORD, UserRole.ADMIN, UserRole.TENANT), validateRequest(PaymentValidation.getPaymentByIdSchema), paymentController.getPaymentById);

export const paymentRoutes = router;
