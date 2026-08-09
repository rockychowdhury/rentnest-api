import { prisma } from "../../lib/prisma";
import { IPropertyCreatePayload, IPropertyUpdatePayload } from "./property.interface";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { createSlug } from "../../utils/createSlug";
import { propertySelect } from "./property.constants";

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
    const category = await prisma.category.findUniqueOrThrow({
        where: { id: payload.categoryId },
        select: { name: true }
    });

    const uniqueId = Math.random().toString(36).substring(2, 8);
    const slug = createSlug({
        title: `${category.name} ${payload.title}`,
        id: uniqueId
    });

    const property = await prisma.property.create({
        data: {
            landlordId,
            categoryId: payload.categoryId,
            title: payload.title,
            slug,
            description: payload.description,
        },
        select: propertySelect
    });

    return property;
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

const deleteProperty = async (id: string, userId: string, role: string) => {
    if (role !== 'ADMIN') {
        await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    }
    const result = await prisma.property.update({
        where: { id },
        data: { 
            status: PropertyStatus.ARCHIVED,
            deletedAt: new Date()
        },
        select: { id: true, title: true, deletedAt: true }
    });
    return result;
};

const makePropertyInactive = async (id: string, userId: string, role: string) => {
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

    if (!property.isVerified) {
        throw new Error('Property is not verified yet!!!');
    }
    if (property.status !== PropertyStatus.ACTIVE) {
        throw new Error('Property is not active!!!');
    }

    const result = await prisma.property.update({
        where: { id },
        data: { status: PropertyStatus.INACTIVE },
        select: propertySelect
    });
    return result;
};

const restoreProperty = async (id: string, userId: string, role: string) => {
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

    if (!property.isVerified) {
        throw new Error('Can not restore an unverified property!!!');
    }
    if (property.deletedAt !== null) {
        throw new Error('Property does not exit or maybe already deleted!!!');
    }

    const result = await prisma.property.update({
        where: { id },
        data: { status: PropertyStatus.ACTIVE },
        select: propertySelect
    });
    return result;
};

export const propertyCoreService = {
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    makePropertyInactive,
    restoreProperty
};
