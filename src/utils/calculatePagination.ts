import { IQuery } from "../types";

export const calculatePagination = (query?: IQuery) => {
    const searchTerm = query?.searchTerm || "";
    
    const page = query?.page ? parseInt(query.page) : 1;
    const limit = query?.limit ? parseInt(query.limit) : 20;
    const skip = (page - 1) * limit;

    const sortBy = query?.sortBy || 'createdAt';
    const sortOrder = query?.sortOrder || 'desc';

    const orderBy: Record<string, string> = {
        [sortBy]: sortOrder
    };

    return {
        page,
        limit,
        skip,
        take: limit,
        sortBy,
        sortOrder,
        orderBy,
        searchTerm
    };
};
