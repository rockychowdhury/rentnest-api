import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = Router();

router.post("/", userController.createUser);
router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.get("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.getMyProfile);
router.patch("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.updateMyAccount);
router.delete("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.deleteMyAccount);

router.get("/:userId", auth(UserRole.ADMIN), userController.getUserById);
router.patch("/:userId/status", auth(UserRole.ADMIN), userController.updateUserStatusById);
router.post("/:userId/restore", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), userController.restoreUserAccount)

export const userRoute = router;

