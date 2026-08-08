import { prisma } from "../../lib/prisma";
import { DivisionSelect, DistrictSelect, AreaSelect } from "../../../generated/prisma/models";

const divisionSelect: DivisionSelect = {
    id: true,
    name: true,
};

const districtSelect: DistrictSelect = {
    id: true,
    name: true,
    divisionId: true,
};

const areaSelect: AreaSelect = {
    id: true,
    name: true,
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

const getAreasByDistrict = async (districtId: number) => {
    const result = await prisma.area.findMany({
        where: { districtId },
        select: areaSelect,
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getAreaById = async (id: number) => {
    const result = await prisma.area.findUniqueOrThrow({
        where: { id },
        select: {
            ...areaSelect,
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

const searchAreas = async (query: string) => {
    const result = await prisma.area.findMany({
        where: query ? {
            name: { contains: query, mode: "insensitive" }
        } : undefined,
        take: 50,
        select: {
            ...areaSelect,
            district: {
                select: {
                    name: true,
                    division: {
                        select: {
                            name: true,
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
export const geoService = {
    getAllDivisions,
    getDistrictsByDivision,
    getDistrictById,
    getAreasByDistrict,
    getAreaById,
    searchAreas
};

