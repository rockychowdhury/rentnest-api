import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { geoService } from "./geo.service";

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
    const result = await geoService.getAllDivisions();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Divisions retrieved successfully",
        data: result
    });
});

const getDistrictsByDivision = catchAsync(async (req: Request, res: Response) => {
    const { divisionId } = req.params;
    const result = await geoService.getDistrictsByDivision(Number(divisionId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Districts retrieved successfully",
        data: result
    });
});

const getDistrictById = catchAsync(async (req: Request, res: Response) => {
    const { districtId } = req.params;
    const result = await geoService.getDistrictById(Number(districtId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "District retrieved successfully",
        data: result
    });
});

const getAreasByDistrict = catchAsync(async (req: Request, res: Response) => {
    const { districtId } = req.params;
    const result = await geoService.getAreasByDistrict(Number(districtId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Areas retrieved successfully",
        data: result
    });
});

const getAreaById = catchAsync(async (req: Request, res: Response) => {
    const { areaId } = req.params;
    const result = await geoService.getAreaById(Number(areaId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Area retrieved successfully",
        data: result
    });
});

const searchAreas = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    const result = await geoService.searchAreas(q as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Areas searched successfully",
        data: result
    });
});
export const geoController = {
    getAllDivisions,
    getDistrictsByDivision,
    getDistrictById,
    getAreasByDistrict,
    getAreaById,
    searchAreas
};
