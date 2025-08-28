import { IsOptional } from "class-validator";
import { specialist_dto } from "./specialist_dto";
import { city_dto } from "../citys-dto/citys.dto";

export class filters_specialist_dto  {
 
    @IsOptional()
    specialitsFilters ?: specialist_dto[]

   
    @IsOptional()
    cityFilters ?:  city_dto[]
    
    @IsOptional()
    name?:string
}