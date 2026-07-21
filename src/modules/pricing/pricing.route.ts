import { Router } from "express";
import { pricingController } from "./pricing.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/unit/:unitId", pricingController.getPricingByUnitId);
router.post("/unit/:unitId", auth(UserRole.LANDLORD), pricingController.createPricing);
router.patch("/:pricingId", auth(UserRole.LANDLORD), pricingController.updatePricing);
router.delete("/:pricingId", auth(UserRole.LANDLORD), pricingController.deletePricing);

export const pricingRoutes = router;
