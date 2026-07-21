import { prisma } from "../../lib/prisma";
import { IDivisionCreatePayload, IDistrictCreatePayload, IUpazilaCreatePayload } from "./geo.interface";
import { DivisionSelect, DistrictSelect, UpazilaSelect } from "../../../generated/prisma/models";

const divisionSelect: DivisionSelect = {
    id: true,
    name: true,
    bnName: true,
};

const districtSelect: DistrictSelect = {
    id: true,
    name: true,
    bnName: true,
    divisionId: true,
};

const upazilaSelect: UpazilaSelect = {
    id: true,
    name: true,
    bn_name: true,
    districtId: true,
};

const getAllDivisions = async () => {
    const result = await prisma.division.findMany({
        select: divisionSelect,
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getDistrictsByDivision = async (divisionId: number) => {
    const result = await prisma.district.findMany({
        where: { divisionId },
        select: districtSelect,
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getDistrictById = async (id: number) => {
    const result = await prisma.district.findUniqueOrThrow({
        where: { id },
        select: districtSelect
    });
    return result;
};

const getUpazilasByDistrict = async (districtId: number) => {
    const result = await prisma.upazila.findMany({
        where: { districtId },
        select: upazilaSelect,
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getUpazilaById = async (id: number) => {
    const result = await prisma.upazila.findUniqueOrThrow({
        where: { id },
        select: {
            ...upazilaSelect,
            district: {
                select: {
                    ...districtSelect,
                    division: {
                        select: divisionSelect
                    }
                }
            }
        }
    });
    return result;
};

const searchUpazilas = async (query: string) => {
    const result = await prisma.upazila.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { bn_name: { contains: query, mode: "insensitive" } }
            ]
        } : undefined,
        take: 50,
        select: {
            ...upazilaSelect,
            district: {
                select: {
                    name: true,
                    bnName: true,
                    division: {
                        select: {
                            name: true,
                            bnName: true
                        }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const createDivision = async (payload: IDivisionCreatePayload) => {
    const result = await prisma.division.create({
        data: payload,
        select: divisionSelect
    });
    return result;
};

const createDistrict = async (payload: IDistrictCreatePayload) => {
    const result = await prisma.district.create({
        data: payload,
        select: districtSelect
    });
    return result;
};

const createUpazila = async (payload: IUpazilaCreatePayload) => {
    const result = await prisma.upazila.create({
        data: {
            name: payload.name,
            bn_name: payload.bnName,
            districtId: payload.districtId
        },
        select: upazilaSelect
    });
    return result;
};

export const geoService = {
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
