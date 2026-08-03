import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IPropertyCreatePayload, IPropertyUpdatePayload, IPropertyAmenitiesSetPayload} from "./property.interface";
import { IQuery } from "../../types";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { PropertySelect, PropertyWhereInput } from "../../../generated/prisma/models";

const propertySelect: PropertySelect = {
    id: true,
    title: true,
    description: true,
    categoryId: true,
    landlordId: true,
    status: true,
    isFeatured: true,
    totalUnits: true,
    createdAt: true,
    landlord: {
        select: {
            id: true,
            phone: true,
            email: true,
            profile: {
                select: {
                    fullName: true,
                    avatarUrl: true
                }
            }
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
            id: true,
            buildingNo: true,
            streetAddress: true,
            addressLine2: true,
            landmark: true,
            postalCode: true,
            upazilaId: true,
            latitude: true,
            longitude: true,
            upazila: {
                select: {
                    id: true,
                    name: true,
                    districtId: true,
                    district: {
                        select: {
                            id: true,
                            name: true,
                            divisionId: true,
                            division: { select: { id: true, name: true } }
                        }
                    }
                }
            }
        }
    },
    images: {
        select: {
            id: true,
            url: true,
            isCover: true,
            caption: true
        }
    },
    amenities: {
        select: {
            amenity: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    units: {
        where: { deletedAt: null },
        select: {
            id: true,
            unitLabel: true,
            status: true,
            bedrooms: true,
            bathrooms: true,
            sizeSqft: true,
            pricing: {
                where: { isActive: true },
                select: {
                    id: true,
                    rentType: true,
                    rentAmount: true,
                    securityDeposit: true
                }
            }
        }
    }
};

const getAllProperties = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);
    const { location, division, district, upazila, categoryId, minPrice, maxPrice, amenities, availableNow, isFeatured, bedrooms, bathrooms, rentType } = query as any;

    const andConditions: PropertyWhereInput[] = [
        { deletedAt: null },
        { status: PropertyStatus.PUBLISHED }
    ];

    if (isFeatured === 'true' || isFeatured === true) {
        andConditions.push({ isFeatured: true });
    } else if (isFeatured === 'false' || isFeatured === false) {
        andConditions.push({ isFeatured: false });
    }

    if (division) {
        andConditions.push({ address: { upazila: { district: { division: { name: { contains: division, mode: 'insensitive' } } } } } });
    }

    if (district) {
        andConditions.push({ address: { upazila: { district: { name: { contains: district, mode: 'insensitive' } } } } });
    }

    if (upazila) {
        andConditions.push({ address: { upazila: { name: { contains: upazila, mode: 'insensitive' } } } });
    }

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    if (location) {
        andConditions.push({
            address: {
                OR: [
                    { streetAddress: { contains: location, mode: 'insensitive' } },
                    { upazila: { name: { contains: location, mode: 'insensitive' } } },
                    { upazila: { district: { name: { contains: location, mode: 'insensitive' } } } }
                ]
            }
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            units: {
                some: {
                    pricing: {
                        some: {
                            rentAmount: {
                                ...(minPrice && { gte: Number(minPrice) }),
                                ...(maxPrice && { lte: Number(maxPrice) })
                            }
                        }
                    }
                }
            }
        });
    }

    if (amenities) {
        const amenityIds = Array.isArray(amenities) ? amenities : amenities.split(',');
        amenityIds.forEach((id: string) => {
            andConditions.push({
                amenities: { some: { amenityId: id } }
            });
        });
    }

    if (availableNow === 'true' || availableNow === true) {
        andConditions.push({
            units: {
                some: {
                    status: 'AVAILABLE'
                }
            }
        });
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

const getAllPropertiesAdmin = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);
    const { status, categoryId } = query as any;

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
        where: { isFeatured: true, status: PropertyStatus.PUBLISHED, deletedAt: null },
        take: 10,
        select: propertySelect,
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

const getLandlordProperties = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.property.findMany({
            where: { landlordId, status: PropertyStatus.PUBLISHED, deletedAt: null },
            skip,
            take,
            orderBy,
            select: propertySelect
        }),
        prisma.property.count({
            where: { landlordId, status: PropertyStatus.PUBLISHED, deletedAt: null }
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getMyProperties = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);
    const { status, searchTerm, categoryId } = (query || {}) as any;

    const andConditions: PropertyWhereInput[] = [
        { landlordId },
        { deletedAt: null }
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
                    propertyId: true,
                    unitLabel: true,
                    bedrooms: true,
                    bathrooms: true,
                    sizeSqft: true,
                    floor: true,
                    description: true,
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
        let address = null;
        if (payload.address) {
            address = await tx.address.create({
                data: payload.address
            });
        }

        const property = await tx.property.create({
            data: {
                landlordId,
                categoryId: payload.categoryId,
                ...(address && { addressId: address.id }),
                title: payload.title,
                description: payload.description,
            },
            select: propertySelect
        });

        return property;
    });

    return result;
};

const updateProperty = async (id: string, userId: string, role: string, payload: IPropertyUpdatePayload) => {
    let property;
    if (role !== 'ADMIN') {
        property = await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    } else {
        property = await prisma.property.findUniqueOrThrow({
            where: { id }
        });
    }

    const { address, ...propertyData } = payload;
    let updateData: any = { ...propertyData };

    if (address) {
        if (property.addressId) {
            updateData.address = {
                update: address
            };
        } else {
            updateData.address = {
                create: address
            };
        }
    }

    const result = await prisma.property.update({
        where: { id },
        data: updateData,
        select: propertySelect
    });
    return result;
};

const updatePropertyStatus = async (id: string, userId: string, role: string, payload: { status: PropertyStatus }) => {
    let property;
    if (role !== 'ADMIN') {
        property = await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId },
            include: { images: true }
        });
    } else {
        property = await prisma.property.findUniqueOrThrow({
            where: { id },
            include: { images: true }
        });
    }

    if (property.status === PropertyStatus.DRAFT && payload.status === PropertyStatus.PUBLISHED) {
        if (!property.addressId || property.images.length === 0) {
            throw new Error('Property must have an address and at least one image to be published.');
        }
    }

    const result = await prisma.property.update({
        where: { id },
        data: { status: payload.status },
        select: propertySelect
    });
    return result;
};

const setPropertyAmenities = async (id: string, userId: string, role: string, payload: IPropertyAmenitiesSetPayload) => {
    if (role !== 'ADMIN') {
        await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    }

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

const deleteProperty = async (id: string, userId: string, role: string) => {
    if (role !== 'ADMIN') {
        await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    }

    const result = await prisma.property.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true, title: true, deletedAt: true }
    });
    return result;
};

const restoreProperty = async (id: string, userId: string, role: string) => {
    if (role !== 'ADMIN') {
        await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    }

    const result = await prisma.property.update({
        where: { id },
        data: { deletedAt: null },
        select: propertySelect
    });
    return result;
};

export const propertyService = {
    getAllProperties,
    getAllPropertiesAdmin,
    getFeaturedProperties,
    getLandlordProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    setPropertyAmenities,
    deleteProperty,
    restoreProperty
};
