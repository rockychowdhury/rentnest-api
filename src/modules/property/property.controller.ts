import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { propertyService } from "./property.service";

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyService.getAllProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getFeaturedProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyService.getFeaturedProperties();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Featured properties retrieved successfully",
        data: result
    });
});

const getLandlordProperties = catchAsync(async (req: Request, res: Response) => {
    const { landlordId } = req.params;
    const result = await propertyService.getMyProperties(landlordId as string, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Landlord properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getMyProperties = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await propertyService.getMyProperties(userId, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyService.getPropertyById(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property retrieved successfully",
        data: result
    });
});

const createProperty = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const result = await propertyService.createProperty(userId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Property created successfully",
        data: result
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const payload = req.body;
    const result = await propertyService.updateProperty(propertyId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property updated successfully",
        data: result
    });
});

const updatePropertyStatus = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const payload = req.body;
    const result = await propertyService.updatePropertyStatus(propertyId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property status updated successfully",
        data: result
    });
});

const setPropertyAmenities = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const payload = req.body;
    const result = await propertyService.setPropertyAmenities(propertyId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property amenities updated successfully",
        data: result
    });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyService.deleteProperty(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property deleted successfully",
        data: result
    });
});

const restoreProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyService.restoreProperty(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property restored successfully",
        data: result
    });
});

export const propertyController = {
    getAllProperties,
    getFeaturedProperties,
    getLandlordProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    setPropertyAmenities,
    deleteProperty,
    restoreProperty
};
