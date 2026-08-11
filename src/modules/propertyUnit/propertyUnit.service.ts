import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IPropertyUnitCreatePayload, IPropertyUnitUpdatePayload, IPropertyUnitStatusUpdatePayload } from "./propertyUnit.interface";
import { IQuery } from "../../types";
import { PropertyUnitSelect } from "../../../generated/prisma/models";
import { PropertyUnitStatus } from "../../../generated/prisma/enums";

const unitSelect: PropertyUnitSelect = {
    id: true,
    propertyId: true,
    unitLabel: true,
    bedrooms: true,
    bathrooms: true,
    sizeSqft: true,
    floor: true,
    description: true,
    status: true,
    availableFrom: true,
    createdAt: true,
    updatedAt: true,
    pricing: {
        select: {
            id: true,
            rentType: true,
            rentAmount: true,
            securityDeposit: true,
            currency: true,
            isActive: true
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
    }
};

const getUnitsByPropertyId = async (propertyId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.propertyUnit.findMany({
            where: { propertyId, deletedAt: null },
            skip,
            take,
            orderBy,
            select: unitSelect
        }),
        prisma.propertyUnit.count({
            where: { propertyId, deletedAt: null }
        })
    ]);

    return {
        data,
        meta: { page, limit, total }
    };
};

const getPropertyUnitById = async (id: string) => {
    const result = await prisma.propertyUnit.findUniqueOrThrow({
        where: { id, deletedAt: null },
        select: unitSelect
    });
    return result;
};

const createPropertyUnit = async (propertyId: string, landlordId: string, payload: IPropertyUnitCreatePayload) => {
    await prisma.property.findFirstOrThrow({
        where: { id: propertyId, landlordId }
    });

    const { availableFrom, ...unitData } = payload;
    const data: any = { propertyId, ...unitData };
    if (availableFrom !== undefined) {
        data.availableFrom = new Date(availableFrom);
    }

    const result = await prisma.$transaction(async (tx) => {
        const unit = await tx.propertyUnit.create({
            data,
            select: unitSelect
        });

        return unit;
    });

    return result;
};

const updatePropertyUnit = async (id: string, landlordId: string, role: string, payload: IPropertyUnitUpdatePayload) => {
    if (role !== 'ADMIN') {
        await prisma.propertyUnit.findFirstOrThrow({
            where: { id, property: { landlordId } }
        });
    }

    const { availableFrom, ...unitData } = payload;
    const data: any = { ...unitData };
    if (availableFrom !== undefined) {
        data.availableFrom = availableFrom === null ? null : new Date(availableFrom);
    }

    const result = await prisma.propertyUnit.update({
        where: { id },
        data,
        select: unitSelect
    });
    return result;
};

const updatePropertyUnitStatus = async (id: string, landlordId: string, role: string, payload: IPropertyUnitStatusUpdatePayload) => {
    if (role !== 'ADMIN') {
        await prisma.propertyUnit.findFirstOrThrow({
            where: { id, property: { landlordId } }
        });
    }

    const data: any = { status: payload.status };
    if (payload.status === PropertyUnitStatus.AVAILABLE) {
        data.availableFrom = new Date();
    } else if (payload.status === PropertyUnitStatus.OCCUPIED || payload.status === PropertyUnitStatus.MAINTENANCE) {
        data.availableFrom = null;
    }

    const result = await prisma.propertyUnit.update({
        where: { id },
        data,
        select: unitSelect
    });
    return result;
};

const deletePropertyUnit = async (id: string, landlordId: string, role: string) => {
    let targetUnit;
    if (role !== 'ADMIN') {
        targetUnit = await prisma.propertyUnit.findFirstOrThrow({
            where: { id, property: { landlordId } }
        });
    } else {
        targetUnit = await prisma.propertyUnit.findUniqueOrThrow({
            where: { id }
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        const deletedUnit = await tx.propertyUnit.update({
            where: { id: targetUnit.id },
            data: { deletedAt: new Date() },
            select: { id: true, propertyId: true, unitLabel: true, deletedAt: true }
        });

        return deletedUnit;
    });

    return result;
};

const getPropertyUnitAvailability = async (id: string) => {
    const unit = await prisma.propertyUnit.findUniqueOrThrow({
        where: { id, deletedAt: null },
        select: {
            id: true,
            status: true,
            availableFrom: true,
        }
    });

    const isAvailable = unit.status === PropertyUnitStatus.AVAILABLE;

    return {
        isAvailable,
        currentStatus: unit.status,
        availableFrom: unit.availableFrom,
    };
};

const setUnitAmenities = async (id: string, landlordId: string, role: string, payload: { amenityIds: string[] }) => {
    if (role !== 'ADMIN') {
        await prisma.propertyUnit.findFirstOrThrow({ 
            where: { id, property: { landlordId } } 
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.propertyUnitAmenity.deleteMany({
            where: { unitId: id }
        });

        if (payload.amenityIds && payload.amenityIds.length > 0) {
            await tx.propertyUnitAmenity.createMany({
                data: payload.amenityIds.map(amenityId => ({
                    unitId: id,
                    amenityId
                }))
            });
        }

        return tx.propertyUnit.findUnique({
            where: { id },
            select: unitSelect
        });
    });

    return result;
};

export const propertyUnitService = {
    getUnitsByPropertyId,
    getPropertyUnitById,
    createPropertyUnit,
    updatePropertyUnit,
    updatePropertyUnitStatus,
    deletePropertyUnit,
    getPropertyUnitAvailability,
    setUnitAmenities
};
