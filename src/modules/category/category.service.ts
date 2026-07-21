import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePagination";
import { ICategoryCreatePayload, ICategoryUpdatePayload } from "./category.interface";
import { IQuery } from "../../types";
import { CategoryWhereInput, CategorySelect } from "../../../generated/prisma/models";

const categorySelect: CategorySelect = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};

const createCategory = async (payload: ICategoryCreatePayload) => {
    const result = await prisma.category.create({
        data: payload,
        select: categorySelect
    });
    return result;
};

const getAllCategories = async (query: IQuery) => {
    const { searchTerm, page, limit, skip, take, orderBy } = calculatePagination(query);

    const whereConditions: CategoryWhereInput = {};

    if (searchTerm) {
        whereConditions.OR = [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } }
        ];
    }

    const [data, total] = await Promise.all([
        prisma.category.findMany({
            where: whereConditions,
            skip,
            take,
            orderBy,
            select: categorySelect
        }),
        prisma.category.count({
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

const getCategoryById = async (id: string) => {
    const result = await prisma.category.findUniqueOrThrow({
        where: { id },
        select: categorySelect
    });
    return result;
};

const updateCategory = async (id: string, payload: ICategoryUpdatePayload) => {
    const result = await prisma.category.update({
        where: { id },
        data: payload,
        select: categorySelect
    });
    return result;
};

const deleteCategory = async (id: string) => {
    const result = await prisma.category.delete({
        where: { id },
        select: categorySelect
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
