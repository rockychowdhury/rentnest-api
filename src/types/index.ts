export type TMeta = {
    page: number;
    limit: number;
    total: number;
}

export type TResponseData<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: TMeta;
}


export interface IQuery {
    searchTerm?: string;
    limit?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
}