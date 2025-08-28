export interface UsersProfessionalsPanelAdminDto {
  email: string;
  id: string;
  lastnames: string;
  names: string;
  role: "USER_PARTNER" | "DELETED_USER_PARTNER";
  document?: string;
  phone?: string;
  rating?: number;
  title?: string;
  description?: string;
  point?: number;
  web?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  perfilPhoto?: string;
  type_of_payment?: "CLINIC" | "prepaid";
  experience?: number;
}

export interface UsersPanelAdminDtos {
  email: string;
  id: string;
  lastnames: string;
  names: string;
  role: "USER" | "DELETED_USER";
  document?: string;
  phone?: string;
}