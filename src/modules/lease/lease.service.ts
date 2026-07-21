import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { LeaseSelect } from "../../../generated/prisma/models";
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
                    title: true
                }
            }
        }
    }
};

const getMyLeases = async (tenantId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const status = (query as any)?.status;
    const where: any = { tenantId };
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

    const where: any = {
        propertyUnit: { property: { landlordId } }
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

const getLeaseById = async (id: string) => {
    const result = await prisma.lease.findUniqueOrThrow({
        where: { id },
        select: leaseSelect
    });
    return result;
};

const updateLeaseStatus = async (id: string, landlordId: string, payload: ILeaseUpdateStatusPayload) => {

    await prisma.lease.findFirstOrThrow({
        where: { id, propertyUnit: { property: { landlordId } } }
    });

    const result = await prisma.$transaction(async (tx) => {
        const lease = await tx.lease.update({
            where: { id },
            data: { status: payload.status as any },
            select: leaseSelect
        });

        if (payload.status === LeaseStatus.TERMINATED || payload.status === LeaseStatus.COMPLETED) {
            await tx.propertyUnit.update({
                where: { id: lease.propertyUnitId },
                data: { status: PropertyUnitStatus.AVAILABLE}
            });
        }
        return lease;
    });

    return result;
};

const getLeasePayments = async (id: string) => {
    const result = await prisma.payment.findMany({
        where: { leaseId: id },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

export const leaseService = {
    getMyLeases,
    getLandlordLeases,
    getLeaseById,
    updateLeaseStatus,
    getLeasePayments
};
