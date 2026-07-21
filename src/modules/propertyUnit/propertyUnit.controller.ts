import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { propertyUnitService } from "./propertyUnit.service";

const getUnitsByPropertyId = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyUnitService.getUnitsByPropertyId(propertyId as string, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property units retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getPropertyUnitById = catchAsync(async (req: Request, res: Response) => {
    const { propertyUnitId } = req.params;
    const result = await propertyUnitService.getPropertyUnitById(propertyUnitId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property unit retrieved successfully",
        data: result
    });
});

const createPropertyUnit = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const payload = req.body;
    const result = await propertyUnitService.createPropertyUnit(propertyId as string, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Property unit created successfully",
        data: result
    });
});

const updatePropertyUnit = catchAsync(async (req: Request, res: Response) => {
    const { propertyUnitId } = req.params;
    const payload = req.body;
    const result = await propertyUnitService.updatePropertyUnit(propertyUnitId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property unit updated successfully",
        data: result
    });
});

const updatePropertyUnitStatus = catchAsync(async (req: Request, res: Response) => {
    const { propertyUnitId } = req.params;
    const payload = req.body;
    const result = await propertyUnitService.updatePropertyUnitStatus(propertyUnitId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property unit status updated successfully",
        data: result
    });
});

const deletePropertyUnit = catchAsync(async (req: Request, res: Response) => {
    const { propertyUnitId } = req.params;
    const result = await propertyUnitService.deletePropertyUnit(propertyUnitId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property unit deleted successfully",
        data: result
    });
});

const getPropertyUnitAvailability = catchAsync(async (req: Request, res: Response) => {
    const { propertyUnitId } = req.params;
    const result = await propertyUnitService.getPropertyUnitAvailability(propertyUnitId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property unit availability retrieved successfully",
        data: result
    });
});

export const propertyUnitController = {
    getUnitsByPropertyId,
    getPropertyUnitById,
    createPropertyUnit,
    updatePropertyUnit,
    updatePropertyUnitStatus,
    deletePropertyUnit,
    getPropertyUnitAvailability
};
