export interface IPropertyImageCreatePayload {
  url: string;
  deleteUrl?: string;
  caption?: string;
  isCover?: boolean;
}

export interface IPropertyImageUpdatePayload {
  url?: string;
  deleteUrl?: string;
  caption?: string;
  isCover?: boolean;
}