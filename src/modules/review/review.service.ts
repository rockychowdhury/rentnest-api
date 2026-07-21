import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { ReviewSelect } from "../../../generated/prisma/models";
import { IReviewCreatePayload, IReviewRespondPayload, IReviewUpdatePayload } from "./review.interface";

const reviewSelect: ReviewSelect = {
    id: true,
    propertyId: true,
    leaseId: true,
    tenantId: true,
    rating: true,
    comment: true,
    landlordResponse: true,
    createdAt: true,
    updatedAt: true,
    tenant: {
        select: {
            id: true,
            profile: {
                select: {
                    fullName: true,
                    avatarUrl: true
                }
            }
        }
    }
};

const getReviewsByPropertyId = async (propertyId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.review.findMany({
            where: { propertyId },
            skip,
            take,
            orderBy,
            select: reviewSelect
        }),
        prisma.review.count({ where: { propertyId } })
    ]);

    return { data, meta: { page, limit, total } };
};

const createReview = async (tenantId: string, payload: IReviewCreatePayload) => {
    if (payload.leaseId) {
        await prisma.lease.findFirstOrThrow({
            where: {
                id: payload.leaseId,
                tenantId,
                propertyUnit: {
                    propertyId: payload.propertyId
                }
            }
        });
    }

    const result = await prisma.review.create({
        data: {
            tenantId,
            ...payload
        },
        select: reviewSelect
    });
    return result;
};

const updateReview = async (id: string, tenantId: string, payload: IReviewUpdatePayload) => {
    await prisma.review.findFirstOrThrow({
        where: { id, tenantId }
    });

    const result = await prisma.review.update({
        where: { id },
        data: payload,
        select: reviewSelect
    });
    return result;
};

const deleteReview = async (id: string, userId: string, role: string) => {
    const review = await prisma.review.findUniqueOrThrow({ where: { id } });

    if (review.tenantId !== userId && role !== 'ADMIN') {
        throw new Error("You do not have permission to delete this review.");
    }

    const result = await prisma.review.delete({
        where: { id },
        select: reviewSelect
    });
    return result;
};

const respondToReview = async (id: string, landlordId: string, payload: IReviewRespondPayload) => {

    await prisma.review.findFirstOrThrow({
        where: {
            id,
            property: { landlordId }
        }
    });

    const result = await prisma.review.update({
        where: { id },
        data: { landlordResponse: payload.landlordResponse },
        select: reviewSelect
    });
    return result;
};

export const reviewService = {
    getReviewsByPropertyId,
    createReview,
    updateReview,
    deleteReview,
    respondToReview
};
