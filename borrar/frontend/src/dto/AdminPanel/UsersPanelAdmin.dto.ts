export interface UsersProfessionalsPanelAdminDto {
  email: number;
  id: string;
  lastnames: number;
  names: number;
  role: "USER_PARTNER" | "DELETED_USER_PARTNER";
}


export interface UsersPanelAdminDtos {
  email: number;
  id: string;
  lastnames: number;
  names: number;
  role: "USER" | "DELETED_USER";
}
