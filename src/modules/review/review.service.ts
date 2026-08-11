import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IQuery } from "../../types";
import { ReviewSelect } from "../../../generated/prisma/models";
import { IReviewCreatePayload, IReviewRespondPayload, IReviewUpdatePayload } from "./review.interface";
import { LeaseStatus } from "../../../generated/prisma/enums";

const refreshPropertyRating = async (propertyId: string, client: any = prisma) => {
    const agg = await client.review.aggregate({
        where: { propertyId },
        _avg: { rating: true }
    });
    const rating = agg._avg.rating ?? 0;
    await client.property.update({
        where: { id: propertyId },
        data: { rating: Math.round(rating * 10) / 10 }
    });
};

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

const getAllReviewsAdmin = async (query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const [data, total] = await Promise.all([
        prisma.review.findMany({
            skip,
            take,
            orderBy,
            select: {
                ...reviewSelect,
                property: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        }),
        prisma.review.count()
    ]);

    return { data, meta: { page, limit, total } };
};

const getReviewsForLandlord = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const where = { property: { landlordId } };

    const [data, total] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take,
            orderBy,
            select: {
                ...reviewSelect,
                property: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        }),
        prisma.review.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getReviewsForTenant = async (tenantId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const where = { tenantId };

    const [data, total] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take,
            orderBy,
            select: {
                ...reviewSelect,
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
        }),
        prisma.review.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const createReview = async (tenantId: string, payload: IReviewCreatePayload) => {
    const {leaseId, propertyId} = payload;
    if (leaseId) {
        const lease = await prisma.lease.findFirstOrThrow({
            where: {
                id: leaseId,
                tenantId,
                propertyUnit: {
                    propertyId
                }
            }
        });
        if (lease.status !== LeaseStatus.COMPLETED && lease.status !== LeaseStatus.TERMINATED) {
            throw new Error("Your lease status must be Completed or Terminated to leave a review.");
        }
    }

    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                tenantId,
                ...payload
            },
            select: reviewSelect
        });

        await refreshPropertyRating(payload.propertyId, tx);

        return review;
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

    await refreshPropertyRating(result.propertyId);

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

    await refreshPropertyRating(result.propertyId);

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
    getAllReviewsAdmin,
    getReviewsForLandlord,
    getReviewsForTenant,
    createReview,
    updateReview,
    deleteReview,
    respondToReview
}
