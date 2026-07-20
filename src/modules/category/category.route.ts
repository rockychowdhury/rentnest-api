import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
router.patch("/:categoryId", auth(UserRole.ADMIN), categoryController.updateCategory);
router.delete("/:categoryId", auth(UserRole.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
