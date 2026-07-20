export interface ICategoryCreatePayload {
  name: string;
  description?: string;
}

export interface ICategoryUpdatePayload {
  name?: string;
  description?: string;
}
