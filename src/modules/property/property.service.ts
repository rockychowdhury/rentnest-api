import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IPropertyCreatePayload, IPropertyUpdatePayload, IPropertyAmenitiesSetPayload} from "./property.interface";
import { IQuery } from "../../types";
import { PropertyStatus } from "../../../generated/prisma/enums";

const propertySelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    isFeatured: true,
    createdAt: true,
    landlord: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
        }
    },
    category: {
        select: {
            id: true,
            name: true
        }
    },
    address: {
        select: {
            streetAddress: true,
            buildingNo: true,
            upazila: {
                select: {
                    name: true,
                    district: {
                        select: { name: true, division: { select: { name: true } } }
                    }
                }
            }
        }
    }
};

const getAllProperties = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);

    const whereConditions: any = {
        deletedAt: null
    };

    if (searchTerm) {
        whereConditions.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } }
        ];
    }

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
        where: { isFeatured: true, deletedAt: null },
        take: 10,
        select: propertySelect,
        orderBy: { createdAt: 'desc' }
    });
    return result;
};


const getMyProperties = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: { landlordId, deletedAt: null },
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: { landlordId, deletedAt: null }
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getPropertyById = async (id: string) => {
    const result = await prisma.property.findUniqueOrThrow({
        where: { id, deletedAt: null },
        select: {
            ...propertySelect,
            amenities: {
                select: {
                    amenity: { select: { id: true, name: true, description: true } }
                }
            },
            units: {
                select: {
                    id: true,
                    unitLabel: true,
                    bedrooms: true,
                    bathrooms: true,
                    sizeSqft: true,
                    status: true,
                    pricing: {
                        select: { rentAmount: true, securityDeposit: true }
                    }
                }
            },
            images: {
                select: { id: true, url: true, isCover: true }
            }
        }
    });
    return result;
};

const createProperty = async (landlordId: string, payload: IPropertyCreatePayload) => {
    const result = await prisma.$transaction(async (tx) => {
        const address = await tx.address.create({
            data: payload.address
        });

        const property = await tx.property.create({
            data: {
                landlordId,
                categoryId: payload.categoryId,
                addressId: address.id,
                title: payload.title,
                description: payload.description,
            },
            select: propertySelect
        });

        return property;
    });

    return result;
};

const updateProperty = async (id: string, payload: IPropertyUpdatePayload) => {
    const result = await prisma.property.update({
        where: { id },
        data: payload,
        select: propertySelect
    });
    return result;
};

const updatePropertyStatus = async (id: string, payload: { status: PropertyStatus }) => {
    const result = await prisma.property.update({
        where: { id },
        data: { status: payload.status },
        select: propertySelect
    });
    return result;
};

const setPropertyAmenities = async (id: string, payload: IPropertyAmenitiesSetPayload) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.propertyAmenity.deleteMany({
            where: { propertyId: id }
        });

        if (payload.amenityIds && payload.amenityIds.length > 0) {
            await tx.propertyAmenity.createMany({
                data: payload.amenityIds.map(amenityId => ({
                    propertyId: id,
                    amenityId
                }))
            });
        }

        return tx.property.findUnique({
            where: { id },
            select: propertySelect
        });
    });

    return result;
};

const deleteProperty = async (id: string) => {
    const result = await prisma.property.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true, title: true, deletedAt: true }
    });
    return result;
};

const restoreProperty = async (id: string) => {
    const result = await prisma.property.update({
        where: { id },
        data: { deletedAt: null },
        select: propertySelect
    });
    return result;
};

export const propertyService = {
    getAllProperties,
    getFeaturedProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    setPropertyAmenities,
    deleteProperty,
    restoreProperty
};
