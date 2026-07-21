import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IRentalRequestCreatePayload, IRentalRequestRespondPayload } from "./rentalRequest.interface";
import { IQuery } from "../../types";
import { RentalRequestSelect, RentalRequestWhereInput } from "../../../generated/prisma/models";
import { PropertyUnitStatus, RentalRequestStatus } from "../../../generated/prisma/enums";

const requestSelect: RentalRequestSelect = {
    id: true,
    tenantId: true,
    propertyUnitId: true,
    pricingId: true,
    agreedAmount: true,
    rentType: true,
    moveInDate: true,
    duration: true,
    message: true,
    status: true,
    landlordResponse: true,
    respondedAt: true,
    createdAt: true,
    propertyUnit: {
        select: {
            id: true,
            unitLabel: true,
            property: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    },
    tenant: {
        select: {
            id: true,
            profile: { select: { fullName: true } }
        }
    }
};

const createRentalRequest = async (tenantId: string, payload: IRentalRequestCreatePayload) => {
    const pricing = await prisma.pricing.findUniqueOrThrow({
        where: { id: payload.pricingId }
    });

    const result = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyUnitId: payload.propertyUnitId,
            pricingId: payload.pricingId,
            moveInDate: new Date(payload.moveInDate),
            duration: payload.duration,
            message: payload.message,
            agreedAmount: pricing.rentAmount,
            rentType: pricing.rentType
        },
        select: requestSelect
    });
    return result;
};

const getMyRentalRequests = async (tenantId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);
    
    const status = (query as any)?.status;
    const where: RentalRequestWhereInput = { tenantId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
        prisma.rentalRequest.findMany({
            where,
            skip,
            take,
            orderBy,
            select: requestSelect
        }),
        prisma.rentalRequest.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getIncomingRentalRequests = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);
    
    const status = (query as any)?.status;
    const propertyUnitId = (query as any)?.propertyUnitId;

    const where: RentalRequestWhereInput = {
        propertyUnit: {
            property: {
                landlordId
            }
        }
    };
    if (status) where.status = status;
    if (propertyUnitId) where.propertyUnitId = propertyUnitId;

    const [data, total] = await Promise.all([
        prisma.rentalRequest.findMany({
            where,
            skip,
            take,
            orderBy,
            select: requestSelect
        }),
        prisma.rentalRequest.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getRentalRequestById = async (id: string) => {
    const result = await prisma.rentalRequest.findUniqueOrThrow({
        where: { id },
        select: requestSelect
    });
    return result;
};

const cancelRentalRequest = async (id: string, tenantId: string) => {
    await prisma.rentalRequest.findFirstOrThrow({
        where: { id, tenantId }
    });
    const result = await prisma.rentalRequest.update({
        where: { id },
        data: { status: RentalRequestStatus.CANCELLED },
        select: requestSelect
    });
    return result;
};

const respondToRentalRequest = async (id: string, landlordId: string, payload: IRentalRequestRespondPayload) => {
    const rentReq = await prisma.rentalRequest.findFirstOrThrow({
        where: { 
            id,
            propertyUnit: { property: { landlordId } }
        }
    });
    const result = await prisma.$transaction(async (tx) => {
        const updatedReq = await tx.rentalRequest.update({
            where: { id },
            data: {
                status: payload.status,
                landlordResponse: payload.landlordResponse,
                respondedAt: new Date()
            },
            select: requestSelect
        });

        if (payload.status === RentalRequestStatus.APPROVED) {
            const unit = await tx.propertyUnit.findUnique({ where: { id: rentReq.propertyUnitId } });
            if (unit?.status !== PropertyUnitStatus.AVAILABLE) {
                throw new Error("Unit is not available for leasing.");
            }
            await tx.lease.create({
                data: {
                    propertyUnitId: rentReq.propertyUnitId,
                    tenantId: rentReq.tenantId,
                    rentalRequestId: id,
                    rentType: rentReq.rentType,
                    agreedAmount: rentReq.agreedAmount,
                    startDate: rentReq.moveInDate,
                }
            });

            await tx.propertyUnit.update({
                where: { id: rentReq.propertyUnitId },
                data: { status:PropertyUnitStatus.OCCUPIED}
            });
        }

        return updatedReq;
    });

    return result;
};

export const rentalRequestService = {
    createRentalRequest,
    getMyRentalRequests,
    getIncomingRentalRequests,
    getRentalRequestById,
    cancelRentalRequest,
    respondToRentalRequest
};
