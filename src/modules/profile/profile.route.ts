import { Router } from "express";
import { profileController } from "./profile.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { ProfileValidation } from "./profile.validation";

const router = Router();

router.get("/:userId", validateRequest(ProfileValidation.getProfileByUserIdSchema), profileController.getProfileByUserId)
router.patch("/me",auth(UserRole.ADMIN,UserRole.LANDLORD,UserRole.TENANT), validateRequest(ProfileValidation.updateProfileSchema), profileController.updateMyProfile)

export const profileRoutes = router;