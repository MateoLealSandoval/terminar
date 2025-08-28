import type { citys_dto } from "./citys.dto";
import type { specialist } from "./professional.dto";

export interface filters_profesional{
    specialitsFilters:specialist[]
    cityFilters:citys_dto[]
    name?:string
}