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

const getUpazilasByDistrict = catchAsync(async (req: Request, res: Response) => {
    const { districtId } = req.params;
    const result = await geoService.getUpazilasByDistrict(Number(districtId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Upazilas retrieved successfully",
        data: result
    });
});

const getUpazilaById = catchAsync(async (req: Request, res: Response) => {
    const { upazilaId } = req.params;
    const result = await geoService.getUpazilaById(Number(upazilaId as string));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Upazila retrieved successfully",
        data: result
    });
});

const searchUpazilas = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    const result = await geoService.searchUpazilas(q as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Upazilas searched successfully",
        data: result
    });
});

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await geoService.createDivision(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Division created successfully",
        data: result
    });
});

const createDistrict = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await geoService.createDistrict(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "District created successfully",
        data: result
    });
});

const createUpazila = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await geoService.createUpazila(payload);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Upazila created successfully",
        data: result
    });
});

export const geoController = {
    getAllDivisions,
    getDistrictsByDivision,
    getDistrictById,
    getUpazilasByDistrict,
    getUpazilaById,
    searchUpazilas,
    createDivision,
    createDistrict,
    createUpazila
};
