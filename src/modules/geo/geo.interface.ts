export interface IDivisionCreatePayload {
  name: string;
  bnName?: string;
}

export interface IDistrictCreatePayload {
  name: string;
  bnName?: string;
  divisionId: number;
}

export interface IUpazilaCreatePayload {
  name: string;
  bnName?: string;
  districtId: number;
}
