import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { reviewService } from "./review.service";

const getReviewsByPropertyId = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await reviewService.getReviewsByPropertyId(propertyId as string, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Reviews retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;
    const result = await reviewService.createReview(tenantId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Review created successfully",
        data: result
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const tenantId = req.user?.id as string;
    const payload = req.body;
    const result = await reviewService.updateReview(reviewId as string, tenantId, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Review updated successfully",
        data: result
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await reviewService.deleteReview(reviewId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Review deleted successfully",
        data: result
    });
});

const respondToReview = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const landlordId = req.user?.id as string;
    const payload = req.body;
    const result = await reviewService.respondToReview(reviewId as string, landlordId, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Responded to review successfully",
        data: result
    });
});

export const reviewController = {
    getReviewsByPropertyId,
    createReview,
    updateReview,
    deleteReview,
    respondToReview
};
