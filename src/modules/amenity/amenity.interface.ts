import { AmenityType } from "../../../generated/prisma/enums";

export interface IAmenityCreatePayload {
  name: string;
  description?: string;
  type?: AmenityType;
}

export interface IAmenityUpdatePayload {
  name?: string;
  description?: string;
  type?: AmenityType;
}
