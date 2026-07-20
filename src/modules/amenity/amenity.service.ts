import { prisma } from "../../lib/prisma";
import { IAmenityCreatePayload, IAmenityUpdatePayload } from "./amenity.interface";
import { IQuery } from "../../types";
import { AmenityWhereInput } from "../../../generated/prisma/models";

const createAmenity = async (payload: IAmenityCreatePayload) => {
    const result = await prisma.amenity.create({
        data: payload
    });
    return result;
};

const getAllAmenities = async (query: IQuery) => {
    const { searchTerm, page, limit, sortBy, sortOrder } = query;

    const limitNumber = limit ? parseInt(limit) : 20;
    const pageNumber = page ? parseInt(page) : 1;
    const skip = (pageNumber - 1) * limitNumber;

    const whereConditions: AmenityWhereInput = {};

    if (searchTerm) {
        whereConditions.OR = [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } }
        ];
    }

    const sortOptions: any = {};
    if (sortBy) {
        sortOptions[sortBy] = sortOrder || 'asc';
    } else {
        sortOptions['createdAt'] = 'desc';
    }

    const [data, total] = await Promise.all([
        prisma.amenity.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: sortOptions,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            }
        }),
        prisma.amenity.count({
            where: whereConditions
        })
    ]);

    return {
        data,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total
        }
    };
};

const updateAmenity = async (id: string, payload: IAmenityUpdatePayload) => {
    const result = await prisma.amenity.update({
        where: { id },
        data: payload
    });
    return result;
};

const deleteAmenity = async (id: string) => {
    const result = await prisma.amenity.delete({
        where: { id },
        select: {
            id: true,
            name: true,
        }
    });
    return result;
};

export const amenityService = {
    createAmenity,
    getAllAmenities,
    updateAmenity,
    deleteAmenity
};
