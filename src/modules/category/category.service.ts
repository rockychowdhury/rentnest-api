import { prisma } from "../../lib/prisma";
import { ICategoryCreatePayload, ICategoryUpdatePayload } from "./category.interface";
import { IQuery } from "../../types";
import { CategoryWhereInput } from "../../../generated/prisma/models";

const createCategory = async (payload: ICategoryCreatePayload) => {
    const result = await prisma.category.create({
        data: payload,
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
};

const getAllCategories = async (query: IQuery) => {
    const { searchTerm, page, limit, sortBy, sortOrder } = query;
    
    const limitNumber = limit ? parseInt(limit) : 20;
    const pageNumber = page ? parseInt(page) : 1;
    const skip = (pageNumber - 1) * limitNumber;

    const whereConditions: CategoryWhereInput = {};

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
        prisma.category.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: sortOptions,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            }
        }),
        prisma.category.count({
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

const getCategoryById = async (id: string) => {
    const result = await prisma.category.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
};

const updateCategory = async (id: string, payload: ICategoryUpdatePayload) => {
    const result = await prisma.category.update({
        where: { id },
        data: payload,
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
};

const deleteCategory = async (id: string) => {
    const result = await prisma.category.delete({
        where: { id },
        select: {
            id: true,
            name: true,
        }
    });
    return result;
};

export const categoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
