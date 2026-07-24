import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.get("/", validateRequest(CategoryValidation.getAllCategoriesSchema), categoryController.getAllCategories);
router.get("/:categoryId", validateRequest(CategoryValidation.getCategoryByIdSchema), categoryController.getCategoryById);
router.post("/", auth(UserRole.ADMIN), validateRequest(CategoryValidation.createCategorySchema), categoryController.createCategory);
router.patch("/:categoryId", auth(UserRole.ADMIN), validateRequest(CategoryValidation.updateCategorySchema), categoryController.updateCategory);
router.delete("/:categoryId", auth(UserRole.ADMIN), validateRequest(CategoryValidation.deleteCategorySchema), categoryController.deleteCategory);

export const categoryRoutes = router;
