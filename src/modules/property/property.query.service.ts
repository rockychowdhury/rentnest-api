import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { PropertyStatus, PropertyUnitStatus } from "../../../generated/prisma/enums";
import { PricingWhereInput, PropertyUnitWhereInput, PropertyWhereInput } from "../../../generated/prisma/models";
import { propertySelect, publicPropertySelect, formatPublicProperty } from "./property.constants";

const buildPropertyOrderBy = (sortBy: string, sortOrder: string): any => {
    if (sortBy === 'popular') {
        return [
            { reviews: { _count: sortOrder } },
            { rating: sortOrder },
            { createdAt: sortOrder }
        ];
    }
    return { [sortBy]: sortOrder };
};

const parseBooleanParam = (value: any): boolean | undefined => {
    if (value === true || value === 'true' || value === '1') return true;
    if (value === false || value === 'false' || value === '0') return false;
    return undefined;
};

/**
 * Shared unit-level conditions derived from the public query params
 * (AVAILABLE unit + bedrooms/bathrooms + pricing range/rent type + amenities).
 * Used both for the property-level `units.some` filter and for resolving the
 * exact units that count when sorting properties by price.
 */
const buildPublicUnitWhere = (query: any = {}, unitExtra: PropertyUnitWhereInput = {}): PropertyUnitWhereInput => {
    const { bedrooms, bathrooms, minPrice, maxPrice, rentType, amenities } = query;

    const unitConditions: PropertyUnitWhereInput = {
        deletedAt: null,
        status: PropertyUnitStatus.AVAILABLE,
        ...unitExtra
    };
    const unitAndConditions: PropertyUnitWhereInput[] = [];

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

    return unitConditions;
};

/**
 * Shared property-level conditions derived from the public query params
 * (active/undeleted property, featured, category, location, search, time filter).
 */
const buildPublicPropertyBaseWhere = (query: any = {}): PropertyWhereInput => {
    const { searchTerm, categoryId, timeFilter, areaId, districtId, divisionId } = query;

    const andConditions: PropertyWhereInput[] = [
        { deletedAt: null },
        { status: PropertyStatus.ACTIVE }
    ];

    const isFeatured = parseBooleanParam(query.isFeatured);
    if (isFeatured !== undefined) {
        andConditions.push({ isFeatured });
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
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        let startDate: Date | null = null;
        if (timeFilter === 'today') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        } else if (timeFilter === 'this-month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        }
        if (startDate) {
            andConditions.push({ createdAt: { gte: startDate, lte: endDate } });
        }
    }

    return { AND: andConditions };
};

/**
 * Shared client-facing property filter builder.
 * Every public endpoint maps its query params to this where clause so all
 * endpoints behave consistently. `unitExtra` merges extra filters into the
 * SAME "property has at least one matching AVAILABLE unit" condition.
 */
const buildPublicPropertyWhere = (query: any = {}, unitExtra: PropertyUnitWhereInput = {}): PropertyWhereInput => {
    const { propertyConditions, unitWhere } = {
        propertyConditions: buildPublicPropertyBaseWhere(query).AND as PropertyWhereInput[],
        unitWhere: buildPublicUnitWhere(query, unitExtra)
    };
    return { AND: [...propertyConditions, { units: { some: unitWhere } }] };
};

const getCuratedPagination = (query: IQuery, defaultLimit = 10) => {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? Math.min(parseInt(query.limit, 10), 20) : defaultLimit;
    return { page, limit, skip: (page - 1) * limit, take: limit };
};

const emptyResult = (query: IQuery) => {
    const { page, limit } = getCuratedPagination(query);
    return { data: [], meta: { page, limit, total: 0 } };
};

const resolveCategoryIdByName = async (name: string): Promise<string | null> => {
    const category = await prisma.category.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        select: { id: true }
    });
    return category?.id ?? null;
};

const resolveDistrictIdByName = async (name: string): Promise<number | null> => {
    const district = await prisma.district.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        select: { id: true }
    });
    return district?.id ?? null;
};

const getAllProperties = async (query: any) => {
    if (query.sortBy === 'rentAmount') {
        return getPropertiesSortedByMinRent(query, query.sortOrder === 'desc' ? 'desc' : 'asc');
    }
    if (query.quickAvailable === 'true' || query.quickAvailable === true) {
        return getQuickAvailableProperties(query);
    }
    if (query.flexibleRent === 'true' || query.flexibleRent === true) {
        return getFlexibleRentProperties(query);
    }

    const { page, limit, skip, take, sortBy, sortOrder } = calculatePagination(query);
    const orderBy = buildPropertyOrderBy(sortBy, sortOrder);
    const whereConditions = buildPublicPropertyWhere(query);

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
    const { searchTerm, page, limit, skip, take, sortBy, sortOrder } = calculatePagination(query);
    const orderBy = buildPropertyOrderBy(sortBy, sortOrder);
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

const getFeaturedProperties = async (query: IQuery = {}) => {
    const where = buildPublicPropertyWhere({ ...query, isFeatured: true });
    const result = await prisma.property.findMany({
        where,
        take: 10,
        select: publicPropertySelect,
        orderBy: { createdAt: 'desc' }
    });
    return result.map(p => formatPublicProperty(p, query)).filter((p): p is NonNullable<typeof p> => p !== null);
};

/**
 * Generic public paginated listing used by the curated endpoints that just
 * tweak `where` / `orderBy` on top of the shared query params.
 */
const listPublicProperties = async (
    query: any,
    options: { where?: PropertyWhereInput; orderBy?: any; defaultLimit?: number } = {}
) => {
    const { page, limit, skip, take } = getCuratedPagination(query, options.defaultLimit);
    const orderBy = options.orderBy ?? buildPropertyOrderBy(query?.sortBy || 'createdAt', query?.sortOrder || 'desc');
    const where = options.where ?? buildPublicPropertyWhere(query);

    const [data, total] = await Promise.all([
        prisma.property.findMany({ where, skip, take, orderBy, select: publicPropertySelect }),
        prisma.property.count({ where })
    ]);

    const formattedData = data.map(p => formatPublicProperty(p, query)).filter(p => p !== null);

    return { data: formattedData, meta: { page, limit, total } };
};

/**
 * Sorts properties by the cheapest rent of their cheapest AVAILABLE unit
 * (min across a unit's active pricing rows, then min across the property's
 * units). Used by budget (asc) and luxury (desc) endpoints.
 */
const getPropertiesSortedByMinRent = async (query: any, direction: 'asc' | 'desc') => {
    const { page, limit, skip, take } = getCuratedPagination(query);
    const propertyWhere = buildPublicPropertyBaseWhere(query);
    const unitWhere = buildPublicUnitWhere(query);

    const units = await prisma.propertyUnit.findMany({
        where: { ...unitWhere, property: propertyWhere },
        select: { id: true, propertyId: true }
    });

    if (units.length === 0) return emptyResult(query);

    const unitIds = units.map(u => u.id);

    const pricingRows = await prisma.pricing.groupBy({
        by: ['propertyUnitId'],
        where: { isActive: true, propertyUnitId: { in: unitIds } },
        _min: { rentAmount: true }
    });

    const minRentPerUnit = new Map<string, number>();
    for (const row of pricingRows) {
        if (row._min && row._min.rentAmount != null) {
            const amount = Number(row._min.rentAmount);
            const current = minRentPerUnit.get(row.propertyUnitId);
            if (current === undefined || amount < current) {
                minRentPerUnit.set(row.propertyUnitId, amount);
            }
        }
    }

    const minRentPerProperty = new Map<string, number>();
    for (const unit of units) {
        const unitPrice = minRentPerUnit.get(unit.id);
        if (unitPrice === undefined) continue;
        const current = minRentPerProperty.get(unit.propertyId);
        if (current === undefined || unitPrice < current) {
            minRentPerProperty.set(unit.propertyId, unitPrice);
        }
    }

    const entries = Array.from(minRentPerProperty.entries());
    const multiplier = direction === 'asc' ? 1 : -1;
    entries.sort((a, b) => (a[1] - b[1]) * multiplier || (a[0] < b[0] ? -1 : 1));

    const candidateIds = entries.slice(skip, skip + take).map(([id]) => id);
    if (candidateIds.length === 0) return emptyResult(query);

    const properties = await prisma.property.findMany({
        where: { id: { in: candidateIds }, deletedAt: null, status: PropertyStatus.ACTIVE },
        select: publicPropertySelect
    });

    const indexMap = new Map(candidateIds.map((id, index) => [id, index]));
    properties.sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0));

    const formattedData = properties.map(p => formatPublicProperty(p, query)).filter(p => p !== null);

    return { data: formattedData, meta: { page, limit, total: entries.length } };
};

/**
 * Budget friendly: cheapest available units first (up to 10 by default).
 */
const getBudgetFriendlyProperties = async (query: IQuery) => {
    return getPropertiesSortedByMinRent(query, 'asc');
};

/**
 * Luxury: most expensive available units first (up to 10 by default).
 */
const getLuxuryProperties = async (query: IQuery) => {
    return getPropertiesSortedByMinRent(query, 'desc');
};

/**
 * Quick available: properties whose AVAILABLE unit becomes available within
 * the next 10 days (unit.availableFrom <= now + 10 days).
 */
const getQuickAvailableProperties = async (query: IQuery) => {
    const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const where = buildPublicPropertyWhere(query, { availableFrom: { lte: tenDaysFromNow } });
    return listPublicProperties(query, { where, orderBy: { createdAt: 'asc' } });
};

/**
 * New this month: only properties created during the current calendar month.
 */
const getNewThisMonthProperties = async (query: IQuery) => {
    return listPublicProperties({ ...query, timeFilter: 'this-month' });
};

/**
 * Properties by Category: returns properties belonging to a specific category.
 */
const getPropertiesByCategory = async (categoryId: string, query: IQuery) => {
    return listPublicProperties({ ...query, categoryId });
};

/**
 * Flexible rent: properties that have at least one unit exposing more than
 * one active rent type in the pricing table.
 */
const getFlexibleRentProperties = async (query: IQuery) => {
    const { page, limit, skip, take } = getCuratedPagination(query);
    const baseWhere = buildPublicPropertyWhere(query);

    const grouped = await prisma.pricing.groupBy({
        by: ['propertyUnitId'],
        where: { isActive: true },
        _count: { propertyUnitId: true }
    });

    const flexibleUnitIds = grouped
        .filter(g => g._count.propertyUnitId > 1)
        .map(g => g.propertyUnitId);

    if (flexibleUnitIds.length === 0) return emptyResult(query);

    const where: PropertyWhereInput = {
        AND: [
            baseWhere,
            { units: { some: { id: { in: flexibleUnitIds }, deletedAt: null } } }
        ]
    };

    const orderBy = buildPropertyOrderBy((query as any)?.sortBy || 'createdAt', (query as any)?.sortOrder || 'desc');

    const [data, total] = await Promise.all([
        prisma.property.findMany({ where, skip, take, orderBy, select: publicPropertySelect }),
        prisma.property.count({ where })
    ]);

    const formattedData = data.map(p => formatPublicProperty(p, query)).filter(p => p !== null);

    return { data: formattedData, meta: { page, limit, total } };
};

/**
 * Popular right now: ordered by review count, then rating, then newest.
 */
const getPopularProperties = async (query: IQuery) => {
    return listPublicProperties(query, { orderBy: buildPropertyOrderBy('popular', 'desc') });
};

const getLandlordProperties = async (landlordId: string, query: IQuery) => {
    const { page, limit, skip, take, sortBy, sortOrder } = calculatePagination(query);
    const orderBy = buildPropertyOrderBy(sortBy, sortOrder);

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: { landlordId, status: PropertyStatus.ACTIVE, deletedAt: null },
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: { landlordId, status: PropertyStatus.ACTIVE, deletedAt: null }
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getMyProperties = async (landlordId: string, query: IQuery) => {
    const { searchTerm, page, limit, skip, take, sortBy, sortOrder } = calculatePagination(query);
    const orderBy = buildPropertyOrderBy(sortBy, sortOrder);
    const { status, categoryId } = (query || {}) as any;

    const andConditions: PropertyWhereInput[] = [
        { landlordId },
        { deletedAt: null },
        { status: { not: PropertyStatus.ARCHIVED } }
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
    getBudgetFriendlyProperties,
    getLuxuryProperties,
    getQuickAvailableProperties,
    getNewThisMonthProperties,
    getPropertiesByCategory,
    getFlexibleRentProperties,
    getPopularProperties,
    getLandlordProperties,
    getMyProperties
};