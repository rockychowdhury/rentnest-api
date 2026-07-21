import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { rentalRequestService } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const result = await rentalRequestService.createRentalRequest(userId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Rental request created successfully",
        data: result
    });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await rentalRequestService.getMyRentalRequests(userId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Your rental requests retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getIncomingRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id as string;
    const result = await rentalRequestService.getIncomingRentalRequests(landlordId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Incoming rental requests retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
    const { rentalRequestId } = req.params;
    const result = await rentalRequestService.getRentalRequestById(rentalRequestId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Rental request retrieved successfully",
        data: result
    });
});

const cancelRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const { rentalRequestId } = req.params;
    const tenantId = req.user?.id as string;
    const result = await rentalRequestService.cancelRentalRequest(rentalRequestId as string, tenantId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Rental request cancelled successfully",
        data: result
    });
});

const respondToRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const { rentalRequestId } = req.params;
    const landlordId = req.user?.id as string;
    const payload = req.body;
    const result = await rentalRequestService.respondToRentalRequest(rentalRequestId as string, landlordId, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Responded to rental request successfully",
        data: result
    });
});

export const rentalRequestController = {
    createRentalRequest,
    getMyRentalRequests,
    getIncomingRentalRequests,
    getRentalRequestById,
    cancelRentalRequest,
    respondToRentalRequest
};
