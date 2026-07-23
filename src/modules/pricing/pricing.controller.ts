import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { pricingService } from "./pricing.service";

const getPricingByUnitId = catchAsync(async (req: Request, res: Response) => {
    const { unitId } = req.params;
    const result = await pricingService.getPricingByUnitId(unitId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Pricing retrieved successfully",
        data: result
    });
});

const createPricing = catchAsync(async (req: Request, res: Response) => {
    const { unitId } = req.params;
    const payload = req.body;
    const landlordId = req.user?.id as string;
    const result = await pricingService.createPricing(unitId as string, landlordId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Pricing created successfully",
        data: result
    });
});

const updatePricing = catchAsync(async (req: Request, res: Response) => {
    const { pricingId } = req.params;
    const payload = req.body;
    const landlordId = req.user?.id as string;
    const result = await pricingService.updatePricing(pricingId as string, landlordId, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Pricing updated successfully",
        data: result
    });
});

const deletePricing = catchAsync(async (req: Request, res: Response) => {
    const { pricingId } = req.params;
    const landlordId = req.user?.id as string;
    const result = await pricingService.deletePricing(pricingId as string, landlordId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Pricing deleted successfully",
        data: result
    });
});

export const pricingController = {
    getPricingByUnitId,
    createPricing,
    updatePricing,
    deletePricing
};
