export interface Guest {
  id: number;
  guestType: GuestType;
  nom?: string | null;
  companyName?: string | null;

  phone: string;
  email?: string | null;
  dateBirth?: string | null;

  idNumber: string;
  idType: IDType;

  address?: string | null;
  nationality?: string | null;
  notes? : string,
  createdAt: Date;
}

export enum GuestType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export enum IDType {
  PASSPORT = "PASSPORT",
  NATIONAL_ID = "NATIONAL_ID",
  DRIVER_LICENSE = "DRIVER_LICENSE",
}