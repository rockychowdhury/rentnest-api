export interface IAddressCreatePayload {
  buildingNo: string;
  streetAddress: string;
  addressLine2?: string;
  landmark?: string;
  postalCode: string;
  upazilaId: number;
  latitude?: number;
  longitude?: number;
}

export interface IPropertyCreatePayload {
  categoryId: string;
  address: IAddressCreatePayload;
  title: string;
  description: string;
}

export interface IPropertyUpdatePayload {
  categoryId?: string;
  title?: string;
  description?: string;
  isFeatured?: boolean;
}


export interface IPropertyAmenitiesSetPayload {
  amenityIds: string[];
}