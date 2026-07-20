export interface IAmenityCreatePayload {
  name: string;
  description?: string;
}

export interface IAmenityUpdatePayload {
  name?: string;
  description?: string;
}
