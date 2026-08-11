import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { propertyCoreService } from "./property.core.service";
import { propertyQueryService } from "./property.query.service";
import { propertyVerificationService } from "./property.verification.service";
import { propertyAmenityService } from "./property.amenity.service";
const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getAllProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getAllPropertiesAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getAllPropertiesAdmin(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All properties retrieved successfully (Admin)",
        data: result.data,
        meta: result.meta
    });
});

const getFeaturedProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getFeaturedProperties();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Featured properties retrieved successfully",
        data: result
    });
});

const getBudgetFriendlyProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getBudgetFriendlyProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Budget friendly properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getLuxuryProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getLuxuryProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Luxury properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getQuickAvailableProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getQuickAvailableProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Quick available properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getNewThisMonthProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getNewThisMonthProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "New this month properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getBachelorMessProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getBachelorMessProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Bachelor mess properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getApartmentProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getApartmentProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Apartment/Flat properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getDhakaProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getDhakaProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Dhaka properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getFlexibleRentProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getFlexibleRentProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Flexible rent properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getPopularProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyQueryService.getPopularProperties(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Popular properties retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getLandlordProperties = catchAsync(async (req: Request, res: Response) => {
    const { landlordId } = req.params;
    const result = await propertyQueryService.getLandlordProperties(landlordId as string, req.query);
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
    const result = await propertyQueryService.getMyProperties(userId, req.query);
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
    const result = await propertyCoreService.getPropertyById(propertyId as string);
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
    const result = await propertyCoreService.createProperty(userId, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Property created successfully",
        data: result
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const payload = req.body;
    const result = await propertyCoreService.updateProperty(propertyId as string, userId, role, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property updated successfully",
        data: result
    });
});

const updatePropertyStatus = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const payload = req.body;
    const result = await propertyVerificationService.updatePropertyStatus(propertyId as string, userId, role, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property status updated successfully",
        data: result
    });
});

const setPropertyAmenities = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const payload = req.body;
    const result = await propertyAmenityService.setPropertyAmenities(propertyId as string, userId, role, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property amenities updated successfully",
        data: result
    });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await propertyCoreService.deleteProperty(propertyId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property deleted successfully",
        data: result
    });
});

const makePropertyInactive = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await propertyCoreService.makePropertyInactive(propertyId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property made inactive successfully",
        data: result
    });
});

const restoreProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const result = await propertyCoreService.restoreProperty(propertyId as string, userId, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property restored successfully",
        data: result
    });
});

const requestVerification = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user?.id as string;
    const result = await propertyVerificationService.requestVerification(propertyId as string, userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property submitted for verification successfully",
        data: result
    });
});

const getVerificationQueue = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyVerificationService.getVerificationQueue(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Verification queue retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const verifyProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyVerificationService.verifyProperty(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property verified successfully",
        data: result
    });
});

const rejectProperty = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyVerificationService.rejectProperty(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property rejected successfully",
        data: result
    });
});

export const propertyController = {
    getAllProperties,
    getAllPropertiesAdmin,
    getFeaturedProperties,
    getBudgetFriendlyProperties,
    getLuxuryProperties,
    getQuickAvailableProperties,
    getNewThisMonthProperties,
    getBachelorMessProperties,
    getApartmentProperties,
    getDhakaProperties,
    getFlexibleRentProperties,
    getPopularProperties,
    getLandlordProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    setPropertyAmenities,
    deleteProperty,
    makePropertyInactive,
    restoreProperty,
    requestVerification,
    getVerificationQueue,
    verifyProperty,
    rejectProperty
};
