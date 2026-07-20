import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Category created successfully",
        data: result
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await categoryService.getCategoryById(categoryId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category retrieved successfully",
        data: result
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const payload = req.body;
    const result = await categoryService.updateCategory(categoryId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category updated successfully",
        data: result
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategory(categoryId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Category deleted successfully",
        data: result
    });
});

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
