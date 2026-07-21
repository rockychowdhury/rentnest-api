import { prisma } from "../../lib/prisma";
import { IPricingCreatePayload, IPricingUpdatePayload } from "./pricing.interface";
import { PricingSelect } from "../../../generated/prisma/models";

const pricingSelect: PricingSelect = {
    id: true,
    propertyUnitId: true,
    rentType: true,
    rentAmount: true,
    securityDeposit: true,
    currency: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};

const getPricingByUnitId = async (propertyUnitId: string) => {
    const result = await prisma.pricing.findMany({
        where: { propertyUnitId },
        select: pricingSelect,
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

const createPricing = async (propertyUnitId: string, payload: IPricingCreatePayload) => {
    const result = await prisma.pricing.create({
        data: {
            propertyUnitId,
            ...payload
        },
        select: pricingSelect
    });
    return result;
};

const updatePricing = async (id: string, payload: IPricingUpdatePayload) => {
    const result = await prisma.pricing.update({
        where: { id },
        data: payload,
        select: pricingSelect
    });
    return result;
};

const deletePricing = async (id: string) => {
    const result = await prisma.pricing.delete({
        where: { id },
        select: { id: true, rentType: true }
    });
    return result;
};

export const pricingService = {
    getPricingByUnitId,
    createPricing,
    updatePricing,
    deletePricing
};
