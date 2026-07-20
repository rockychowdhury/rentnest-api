import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


router.post("/login",authController.loginUser)
router.post("/refresh",authController.refreshToken)
router.post("/logout",authController.logout)
router.patch("/change-password",auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT),authController.changeMyPassword)

export const authRoutes = router;