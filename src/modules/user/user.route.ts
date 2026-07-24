import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.post("/", validateRequest(UserValidation.createUserSchema), userController.createUser);
router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.get("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.getMyProfile);
router.patch("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), validateRequest(UserValidation.updateMyAccountSchema), userController.updateMyAccount);
router.delete("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.deleteMyAccount);
router.post("/restore", auth(UserRole.ADMIN), validateRequest(UserValidation.restoreUserAccountSchema), userController.restoreUserAccount)

router.get("/:userId", auth(UserRole.ADMIN), validateRequest(UserValidation.getUserByIdSchema), userController.getUserById);
router.patch("/:userId/status", auth(UserRole.ADMIN), validateRequest(UserValidation.updateUserStatusSchema), userController.updateUserStatusById);

export const userRoute = router;
