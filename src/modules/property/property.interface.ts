export interface IAddressCreatePayload {
  buildingNo: string;
  streetAddress: string;
  addressLine2?: string;
  landmark?: string;
  postalCode: string;
  areaId: number;
  latitude?: number;
  longitude?: number;
}

export interface IPropertyCreatePayload {
  categoryId: string;
  title: string;
  description: string;
}

export interface IPropertyUpdatePayload {
  categoryId?: string;
  title?: string;
  description?: string;
  address?: Partial<IAddressCreatePayload>;
}


export interface IPropertyAmenitiesSetPayload {
  amenityIds: string[];
}