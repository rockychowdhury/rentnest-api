import { Router } from "express";
import { profileController } from "./profile.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/:userId",profileController.getProfileByUserId)
router.patch("/me",auth(UserRole.ADMIN,UserRole.LANDLORD,UserRole.TENANT),profileController.updateMyProfile)

export const profileRoutes = router;