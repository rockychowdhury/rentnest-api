import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { amenityService } from "./amenity.service";

const createAmenity = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await amenityService.createAmenity(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Amenity created successfully",
        data: result
    });
});

const getAllAmenities = catchAsync(async (req: Request, res: Response) => {
    const result = await amenityService.getAllAmenities(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Amenities retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const updateAmenity = catchAsync(async (req: Request, res: Response) => {
    const { amenityId } = req.params;
    const payload = req.body;
    const result = await amenityService.updateAmenity(amenityId as string, payload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Amenity updated successfully",
        data: result
    });
});

const deleteAmenity = catchAsync(async (req: Request, res: Response) => {
    const { amenityId } = req.params;
    const result = await amenityService.deleteAmenity(amenityId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Amenity deleted successfully",
        data: result
    });
});

export const amenityController = {
    createAmenity,
    getAllAmenities,
    updateAmenity,
    deleteAmenity
};
