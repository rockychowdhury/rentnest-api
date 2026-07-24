import { prisma } from "../../lib/prisma";
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
export const geoService = {
    getAllDivisions,
    getDistrictsByDivision,
    getDistrictById,
    getUpazilasByDistrict,
    getUpazilaById,
    searchUpazilas
};
