import { Router } from "express";
import { pricingController } from "./pricing.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { PricingValidation } from "./pricing.validation";

const router = Router();

router.get("/unit/:unitId", validateRequest(PricingValidation.getPricingByUnitIdSchema), pricingController.getPricingByUnitId);
router.post("/unit/:unitId", auth(UserRole.LANDLORD), validateRequest(PricingValidation.createPricingSchema), pricingController.createPricing);
router.patch("/:pricingId", auth(UserRole.LANDLORD), validateRequest(PricingValidation.updatePricingSchema), pricingController.updatePricing);
router.delete("/:pricingId", auth(UserRole.LANDLORD), validateRequest(PricingValidation.deletePricingSchema), pricingController.deletePricing);

export const pricingRoutes = router;
