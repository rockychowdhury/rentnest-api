import { prisma } from "../../lib/prisma";
import { IPropertyImageCreatePayload, IPropertyImageUpdatePayload } from "./propertyImage.interface";
import { PropertyImageSelect } from "../../../generated/prisma/models";

const imageSelect: PropertyImageSelect = {
    id: true,
    propertyId: true,
    url: true,
    deleteUrl: true,
    caption: true,
    isCover: true,
    createdAt: true,
};

const getImagesByPropertyId = async (propertyId: string) => {
    const result = await prisma.propertyImage.findMany({
        where: { propertyId },
        select: imageSelect,
        orderBy: [
            { isCover: 'desc' },
            { createdAt: 'desc' }
        ]
    });
    return result;
};


const createPropertyImage = async (propertyId: string, payload: IPropertyImageCreatePayload) => {
    if (payload.isCover) {
        await prisma.propertyImage.updateMany({
            where: { propertyId, isCover: true },
            data: { isCover: false }
        });
    }

    const result = await prisma.propertyImage.create({
        data: {
            propertyId,
            ...payload
        },
        select: imageSelect
    });
    return result;
};

const updatePropertyImage = async (id: string, payload: IPropertyImageUpdatePayload) => {
    if (payload.isCover) {
        const imageToUpdate = await prisma.propertyImage.findUnique({ where: { id }, select: { propertyId: true } });
        if (imageToUpdate) {
            await prisma.propertyImage.updateMany({
                where: { propertyId: imageToUpdate.propertyId, isCover: true },
                data: { isCover: false }
            });
        }
    }

    const result = await prisma.propertyImage.update({
        where: { id },
        data: payload,
        select: imageSelect
    });
    return result;
};

const deletePropertyImage = async (id: string) => {
    const image = await prisma.propertyImage.findUniqueOrThrow({
        where: { id },
        select: { deleteUrl: true }
    });

    if (image.deleteUrl) {
        try {
            await fetch(image.deleteUrl, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete image from external hosting:", error);
        }
    }

    const result = await prisma.propertyImage.delete({
        where: { id },
        select: { id: true, url: true }
    });
    return result;
};

export const propertyImageService = {
    getImagesByPropertyId,
    createPropertyImage,
    updatePropertyImage,
    deletePropertyImage
};
