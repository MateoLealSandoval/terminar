import type { add_office_professional_dto_id } from "@/dto/professional/office_professional";
import type { date_model } from "./list_resetvations_user";

export interface datas_List_reservation_profeccional_model {
  data:{
    id: string;
    name: string;
    perfilPhoto: string;
    title: string;
    offices: add_office_professional_dto_id[],
    payment:string
  }
  datauser:basic_user_data_dto
  date:date_model
  price:number
}
export interface basic_user_data_dto {
    names:string;
    lastnames:string;
    email:string;
}
 