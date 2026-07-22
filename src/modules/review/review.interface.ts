export interface IReviewCreatePayload {
    propertyId: string;
    leaseId: string;
    rating: number;
    comment?: string;
}

export interface IReviewUpdatePayload {
    rating?: number;
    comment?: string;
}

export interface IReviewRespondPayload {
    landlordResponse: string;
}