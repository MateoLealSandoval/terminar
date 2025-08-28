import type { add_office_professional_dto_id } from "@/dto/professional/office_professional";

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
export interface datas_List_reservation_user_model {
  data:{
    id: string;
    name: string;
    perfilPhoto: string;
    title: string;
    offices: add_office_professional_dto_id[]
    specialists:specialistsModel[]
    phone:string
  }
  date:date_model
  price:number
  payment:string
  status:ReservationStatus
  id:string
}
export interface date_model{
    day: number,
    month: number,
    year: number,
    hour: number,
    minutes: number
}
export interface specialistsModel{
  id:string,
  name:string,
  status:string
}
 