import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { LeaseSelect, LeaseWhereInput } from "../../../generated/prisma/models";
import { ILeaseUpdateStatusPayload } from "./lease.interface";
import { LeaseStatus, PropertyUnitStatus } from "../../../generated/prisma/enums";

const leaseSelect: LeaseSelect = {
    id: true,
    propertyUnitId: true,
    tenantId: true,
    rentalRequestId: true,
    rentType: true,
    agreedAmount: true,
    startDate: true,
    endDate: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    tenant: {
        select: {
            id: true,
            profile: { select: { fullName: true } }
        }
    },
    propertyUnit: {
        select: {
            id: true,
            unitLabel: true,
            property: {
                select: {
                    id: true,
                    title: true,
                    images: {
                        select: {
                            id: true,
                            url: true,
                            isCover: true
                        }
                    }
                }
            }
        }
    }
};

const getAllLeases = async (query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.lease.findMany({
            skip,
            take,
            orderBy,
            select: leaseSelect
        }),
        prisma.lease.count()
    ]);

    return { data, meta: { page, limit, total } };
};

const getMyLeases = async (tenantId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const status = (query as any)?.status;
    const where: LeaseWhereInput = { tenantId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
        prisma.lease.findMany({
            where,
            skip,
            take,
            orderBy,
            select: leaseSelect
        }),
        prisma.lease.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getLandlordLeases = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const status = (query as any)?.status;
    const propertyUnitId = (query as any)?.propertyUnitId;

    const where: LeaseWhereInput = {
        landlordId
    };
    if (status) where.status = status;
    if (propertyUnitId) where.propertyUnitId = propertyUnitId;

    const [data, total] = await Promise.all([
        prisma.lease.findMany({
            where,
            skip,
            take,
            orderBy,
            select: leaseSelect
        }),
        prisma.lease.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getLeaseById = async (id: string, userId: string, role: string) => {
    const where: LeaseWhereInput = { id };
    if (role !== 'ADMIN') {
        where.OR = [
            { tenantId: userId },
            { landlordId: userId }
        ];
    }
    const result = await prisma.lease.findFirstOrThrow({
        where,
        select: leaseSelect
    });
    return result;
};

const updateLeaseStatus = async (id: string, userId: string, role: string, payload: ILeaseUpdateStatusPayload) => {

    if (role !== 'ADMIN') {
        await prisma.lease.findFirstOrThrow({
            where: { id, landlordId: userId }
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        const lease = await tx.lease.update({
            where: { id },
            data: { status: payload.status as any },
            select: leaseSelect
        });

        if (payload.status === LeaseStatus.TERMINATED || payload.status === LeaseStatus.COMPLETED) {
            await tx.propertyUnit.update({
                where: { id: lease.propertyUnitId },
                data: {
                    status: PropertyUnitStatus.AVAILABLE,
                    availableFrom: lease.endDate ?? new Date()
                }
            });
        }
        return lease;
    });

    return result;
};

const getLeasePayments = async (id: string, userId: string, role: string) => {
    const where: any = { id };
    if (role !== 'ADMIN') {
        where.OR = [
            { tenantId: userId },
            { landlordId: userId }
        ];
    }
    await prisma.lease.findFirstOrThrow({ where });

    const result = await prisma.payment.findMany({
        where: { leaseId: id },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

export const leaseService = {
    getAllLeases,
    getMyLeases,
    getLandlordLeases,
    getLeaseById,
    updateLeaseStatus,
    getLeasePayments
};
