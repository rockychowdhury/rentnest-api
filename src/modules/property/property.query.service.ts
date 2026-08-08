import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { PricingWhereInput, PropertyWhereInput } from "../../../generated/prisma/models";
import { propertySelect, publicPropertySelect, formatPublicProperty } from "./property.constants";

const getAllProperties = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);
    const { categoryId, minPrice, maxPrice, amenities, isFeatured, bedrooms, bathrooms, rentType, timeFilter, areaId, districtId, divisionId } = query as any;

    const andConditions: PropertyWhereInput[] = [
        { deletedAt: null },
        { status: PropertyStatus.VERIFIED }
    ];

    if (isFeatured === true) {
        andConditions.push({ isFeatured: true });
    } else if (isFeatured === false) {
        andConditions.push({ isFeatured: false });
    }

    if (areaId) {
        andConditions.push({ address: { areaId: Number(areaId) } });
    } else if (districtId) {
        andConditions.push({ address: { area: { districtId: Number(districtId) } } });
    } else if (divisionId) {
        andConditions.push({ address: { area: { district: { divisionId: Number(divisionId) } } } });
    }

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    if (timeFilter) {
        const now = new Date();
        let startDate: Date;
        let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (timeFilter === 'today') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        } else if (timeFilter === 'this-month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        }
        
        if (startDate!) {
            andConditions.push({
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            });
        }
    }

    // Always filter properties that have at least one available unit matching the criteria
    const unitConditions: any = { deletedAt: null, status: 'AVAILABLE' };
    const unitAndConditions: any[] = [];

    if (bedrooms) {
        unitConditions.bedrooms = { gte: Number(bedrooms) };
    }
    if (bathrooms) {
        unitConditions.bathrooms = { gte: Number(bathrooms) };
    }

        if (minPrice || maxPrice || rentType) {
            const pricingConditions: PricingWhereInput = { isActive: true };
            
            if (minPrice || maxPrice) {
                pricingConditions.rentAmount = {};
                if (minPrice) pricingConditions.rentAmount.gte = Number(minPrice);
                if (maxPrice) pricingConditions.rentAmount.lte = Number(maxPrice);
            }
            if (rentType) pricingConditions.rentType = rentType;

            unitConditions.pricing = { some: pricingConditions };
        }

        if (amenities) {
            const amenityList = amenities.split(',');
            for (const amenity of amenityList) {
                unitAndConditions.push({
                    OR: [
                        { amenities: { some: { amenityId: amenity.trim() } } },
                        { property: { amenities: { some: { amenityId: amenity.trim() } } } }
                    ]
                });
            }
        }

    if (unitAndConditions.length > 0) {
        unitConditions.AND = unitAndConditions;
    }

    andConditions.push({ units: { some: unitConditions } });

    const whereConditions: PropertyWhereInput = {
        AND: andConditions
    };

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy,
            select: publicPropertySelect
        }),
        prisma.property.count({
            where: whereConditions
        })
    ]);

    const formattedData = data.map(p => formatPublicProperty(p, query)).filter(p => p !== null);

    return {
        data: formattedData,
        meta: { page, limit, total }
    };
};

const getAllPropertiesAdmin = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);
    const { status, categoryId } = (query || {}) as any;

    const andConditions: PropertyWhereInput[] = [];

    if (status) {
        andConditions.push({ status });
    }

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    const whereConditions: PropertyWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: whereConditions
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getFeaturedProperties = async () => {
    const result = await prisma.property.findMany({
        where: { isFeatured: true, status: PropertyStatus.VERIFIED, deletedAt: null },
        take: 10,
        select: publicPropertySelect,
        orderBy: { createdAt: 'desc' }
    });
    return result.map(formatPublicProperty);
};

const getLandlordProperties = async (landlordId: string, query: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: { landlordId, status: PropertyStatus.VERIFIED, deletedAt: null },
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: { landlordId, status: PropertyStatus.VERIFIED, deletedAt: null }
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getMyProperties = async (landlordId: string, query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);
    const { status, categoryId } = (query || {}) as any;

    const andConditions: PropertyWhereInput[] = [
        { landlordId }
    ];

    if (status) {
        andConditions.push({ status });
    }

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    const whereConditions: PropertyWhereInput = {
        AND: andConditions
    };

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: whereConditions
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

export const propertyQueryService = {
    getAllProperties,
    getAllPropertiesAdmin,
    getFeaturedProperties,
    getLandlordProperties,
    getMyProperties
};
