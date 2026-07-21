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
    status: true,
    createdAt: true,
    updatedAt: true,
    pricing: {
        select: {
            id: true,
            rentAmount: true,
            securityDeposit: true
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

const createPropertyUnit = async (propertyId: string, payload: IPropertyUnitCreatePayload) => {
    const result = await prisma.propertyUnit.create({
        data: {
            propertyId,
            ...payload
        },
        select: unitSelect
    });
    return result;
};

const updatePropertyUnit = async (id: string, payload: IPropertyUnitUpdatePayload) => {
    const result = await prisma.propertyUnit.update({
        where: { id },
        data: payload,
        select: unitSelect
    });
    return result;
};

const updatePropertyUnitStatus = async (id: string, payload: IPropertyUnitStatusUpdatePayload) => {
    const result = await prisma.propertyUnit.update({
        where: { id },
        data: { status: payload.status },
        select: unitSelect
    });
    return result;
};

const deletePropertyUnit = async (id: string) => {
    const result = await prisma.propertyUnit.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { id: true, unitLabel: true, deletedAt: true }
    });
    return result;
};

const getPropertyUnitAvailability = async (id: string) => {
    const unit = await prisma.propertyUnit.findUniqueOrThrow({
        where: { id, deletedAt: null },
        select: {
            id: true,
            status: true,
        }
    });

    const isAvailable = unit.status === PropertyUnitStatus.AVAILABLE;

    return {
        isAvailable,
        currentStatus: unit.status,
    };
};

export const propertyUnitService = {
    getUnitsByPropertyId,
    getPropertyUnitById,
    createPropertyUnit,
    updatePropertyUnit,
    updatePropertyUnitStatus,
    deletePropertyUnit,
    getPropertyUnitAvailability
};
