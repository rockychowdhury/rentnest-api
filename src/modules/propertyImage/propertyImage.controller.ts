import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { propertyImageService } from "./propertyImage.service";

const getImagesByPropertyId = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const result = await propertyImageService.getImagesByPropertyId(propertyId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property images retrieved successfully",
        data: result
    });
});


const createPropertyImage = catchAsync(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const payload = req.body;
    const result = await propertyImageService.createPropertyImage(propertyId as string, payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Property image created successfully",
        data: result
    });
});

const updatePropertyImage = catchAsync(async (req: Request, res: Response) => {
    const { imageId } = req.params;
    const payload = req.body;
    const result = await propertyImageService.updatePropertyImage(imageId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property image updated successfully",
        data: result
    });
});

const deletePropertyImage = catchAsync(async (req: Request, res: Response) => {
    const { imageId } = req.params;
    const result = await propertyImageService.deletePropertyImage(imageId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Property image deleted successfully",
        data: result
    });
});

export const propertyImageController = {
    getImagesByPropertyId,
    createPropertyImage,
    updatePropertyImage,
    deletePropertyImage
};
