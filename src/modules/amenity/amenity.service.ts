import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { IAmenityCreatePayload, IAmenityUpdatePayload } from "./amenity.interface";
import { IQuery } from "../../types";
import { AmenityWhereInput, AmenitySelect } from "../../../generated/prisma/models";

const amenitySelect: AmenitySelect = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
};

const createAmenity = async (payload: IAmenityCreatePayload) => {
    const result = await prisma.amenity.create({
        data: payload
    });
    return result;
};

const getAllAmenities = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);

    const whereConditions: AmenityWhereInput = {};

    if (searchTerm) {
        whereConditions.OR = [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } }
        ];
    }

    const [data, total] = await Promise.all([
        prisma.amenity.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy,
            select: amenitySelect
        }),
        prisma.amenity.count({
            where: whereConditions
        })
    ]);

    return {
        data,
        meta: {
            page,
            limit,
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
        select: amenitySelect
    });
    return result;
};

export const amenityService = {
    createAmenity,
    getAllAmenities,
    updateAmenity,
    deleteAmenity
};
