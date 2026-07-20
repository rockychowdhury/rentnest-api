import { prisma } from "../../lib/prisma";
import { IDivisionCreatePayload, IDistrictCreatePayload, IUpazilaCreatePayload } from "./geo.interface";

const getAllDivisions = async () => {
    const result = await prisma.division.findMany({
        select: {
            id: true,
            name: true,
            bnName: true,
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getDistrictsByDivision = async (divisionId: number) => {
    const result = await prisma.district.findMany({
        where: { divisionId },
        select: {
            id: true,
            name: true,
            bnName: true,
            divisionId: true,
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
};

const getDistrictById = async (id: number) => {
    const result = await prisma.district.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            bnName: true,
            divisionId: true,
        }
    });
    return result;
};

const getUpazilasByDistrict = async (districtId: number) => {
    const result = await prisma.upazila.findMany({
        where: { districtId },
        select: {
            id: true,
            name: true,
            bn_name: true,
            districtId: true,
        },
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
            id: true,
            name: true,
            bn_name: true,
            districtId: true,
            district: {
                select: {
                    id: true,
                    name: true,
                    bnName: true,
                    division: {
                        select: {
                            id: true,
                            name: true,
                            bnName: true,
                        }
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
        take: 50, // optimal hard limit to ensure fastest response time
        select: {
            id: true,
            name: true,
            bn_name: true,
            districtId: true,
            // Including parent names is critical for typeahead context without N+1 queries
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
        select: {
            id: true,
            name: true,
            bnName: true
        }
    });
    return result;
};

const createDistrict = async (payload: IDistrictCreatePayload) => {
    const result = await prisma.district.create({
        data: payload,
        select: {
            id: true,
            name: true,
            bnName: true,
            divisionId: true
        }
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
        select: {
            id: true,
            name: true,
            bn_name: true,
            districtId: true
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
    searchUpazilas,
    createDivision,
    createDistrict,
    createUpazila
};
