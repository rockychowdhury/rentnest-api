import { prisma } from "../../lib/prisma";
import { IPropertyAmenitiesSetPayload } from "./property.interface";
import { propertySelect } from "./property.constants";

const setPropertyAmenities = async (id: string, userId: string, role: string, payload: IPropertyAmenitiesSetPayload) => {
    if (role !== 'ADMIN') {
        await prisma.property.findFirstOrThrow({ 
            where: { id, landlordId: userId } 
        });
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.propertyAmenity.deleteMany({
            where: { propertyId: id }
        });

        if (payload.amenityIds && payload.amenityIds.length > 0) {
            await tx.propertyAmenity.createMany({
                data: payload.amenityIds.map(amenityId => ({
                    propertyId: id,
                    amenityId
                }))
            });
        }

        return await tx.property.findUnique({
            where: { id },
            select: propertySelect
        });
    });

    return result;
};

export const propertyAmenityService = {
    setPropertyAmenities
};
