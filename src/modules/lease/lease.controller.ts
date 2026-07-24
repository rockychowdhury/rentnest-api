import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { leaseService } from "./lease.service";

const getAllLeases = catchAsync(async (req: Request, res: Response) => {
    const result = await leaseService.getAllLeases(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All leases retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getMyLeases = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id as string;
    const result = await leaseService.getMyLeases(tenantId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Your leases retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getLandlordLeases = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id as string;
    const result = await leaseService.getLandlordLeases(landlordId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Leases retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getLeaseById = catchAsync(async (req: Request, res: Response) => {
    const { leaseId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await leaseService.getLeaseById(leaseId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Lease retrieved successfully",
        data: result
    });
});

const updateLeaseStatus = catchAsync(async (req: Request, res: Response) => {
    const { leaseId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const payload = req.body;
    const result = await leaseService.updateLeaseStatus(leaseId as string, userId, role, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Lease status updated successfully",
        data: result
    });
});

const getLeasePayments = catchAsync(async (req: Request, res: Response) => {
    const { leaseId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await leaseService.getLeasePayments(leaseId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Lease payments retrieved successfully",
        data: result
    });
});

export const leaseController = {
    getAllLeases,
    getMyLeases,
    getLandlordLeases,
    getLeaseById,
    updateLeaseStatus,
    getLeasePayments
};
