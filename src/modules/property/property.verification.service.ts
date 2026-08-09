import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { PropertyStatus } from "../../../generated/prisma/enums";
import { propertySelect } from "./property.constants";

const updatePropertyStatus = async (id: string, userId: string, role: string, payload: { status: PropertyStatus }) => {
    let property;
    if (role !== 'ADMIN') {
        property = await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId }
        });
        
        if (payload.status !== PropertyStatus.INACTIVE) {
            throw new Error('Landlords can only set status to INACTIVE.');
        }
        if (property.status !== PropertyStatus.ACTIVE) {
            throw new Error('Property must be ACTIVE before setting it to INACTIVE.');
        }
    } else {
        property = await prisma.property.findUniqueOrThrow({
            where: { id }
        });
    }

    const result = await prisma.property.update({
        where: { id },
        data: { status: payload.status },
        select: propertySelect
    });
    return result;
};

const requestVerification = async (id: string, userId: string) => {
    const property = await prisma.property.findFirstOrThrow({ 
        where: { id, landlordId: userId },
        include: { 
            images: true, 
            units: true,
            amenities: true
        }
    });

    if (!property.addressId) {
        throw new Error('Property must have an address to request verification.');
    }
    if (property.images.length === 0) {
        throw new Error('Property must have at least one image to request verification.');
    }
    if (property.units.length === 0) {
        throw new Error('Property must have at least one unit to request verification.');
    }
    if (property.amenities.length === 0) {
        throw new Error('Property must have at least one amenity to request verification.');
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedProperty = await tx.property.update({
            where: { id },
            data: { status: PropertyStatus.PENDING_VERIFICATION },
            select: propertySelect
        });

        await tx.propertyVerificationQueue.upsert({
            where: { propertyId: id },
            update: {},
            create: { propertyId: id }
        });

        return updatedProperty;
    });

    return result;
};

const getVerificationQueue = async (query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.propertyVerificationQueue.findMany({
            skip,
            take,
            orderBy,
            include: { property: { select: propertySelect } }
        }),
        prisma.propertyVerificationQueue.count()
    ]);

    return {
        data: data.map((item: any) => item.property),
        meta: { page, limit, total }
    };
};

const verifyProperty = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        const updatedProperty = await tx.property.update({
            where: { id },
            data: { status: PropertyStatus.ACTIVE, isVerified: true },
            select: propertySelect
        });

        await tx.propertyVerificationQueue.deleteMany({
            where: { propertyId: id }
        });

        return updatedProperty;
    });
    return result;
};

const rejectProperty = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        const updatedProperty = await tx.property.update({
            where: { id },
            data: { status: PropertyStatus.REJECTED },
            select: propertySelect
        });

        await tx.propertyVerificationQueue.deleteMany({
            where: { propertyId: id }
        });

        return updatedProperty;
    });
    return result;
};

export const propertyVerificationService = {
    updatePropertyStatus,
    requestVerification,
    getVerificationQueue,
    verifyProperty,
    rejectProperty
};
