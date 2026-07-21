import { PropertyUnitStatus } from "../../../generated/prisma/enums";

export interface IPropertyUnitCreatePayload {
    unitLabel: string;
    bedrooms: number;
    bathrooms: number;
    sizeSqft: number;
}

export interface IPropertyUnitUpdatePayload {
    unitLabel?: string;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqft?: number;
}

export interface IPropertyUnitStatusUpdatePayload {
    status: PropertyUnitStatus;
}