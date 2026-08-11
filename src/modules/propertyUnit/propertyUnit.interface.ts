import { PropertyUnitStatus } from "../../../generated/prisma/enums";

export interface IPropertyUnitCreatePayload {
    unitLabel: string;
    bedrooms: number;
    bathrooms: number;
    sizeSqft: number;
    availableFrom?: Date | string;
}

export interface IPropertyUnitUpdatePayload {
    unitLabel?: string;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqft?: number;
    availableFrom?: Date | string | null;
}

export interface IPropertyUnitStatusUpdatePayload {
    status: PropertyUnitStatus;
}

export interface IPropertyUnitAmenitiesSetPayload {
    amenityIds: string[];
}