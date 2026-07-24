import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(AuthValidation.loginSchema), authController.loginUser)
router.post("/refresh",authController.refreshToken)
router.post("/logout",authController.logout)
router.patch("/change-password", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), validateRequest(AuthValidation.changePasswordSchema), authController.changeMyPassword)

export const authRoutes = router;