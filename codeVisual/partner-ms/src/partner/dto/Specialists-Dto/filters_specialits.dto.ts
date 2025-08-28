import { IsOptional } from "class-validator";
import { specialist_dto } from "./specialist_dto";
import { PaginationDto } from "../pagination.dto";
import { city_dto } from "./city.dto";
 
export class filters_specialist_dto extends PaginationDto{
 
    @IsOptional()
    specialitsFilters ?: specialist_dto[]

    @IsOptional()
    cityFilters ?:  city_dto[]

    @IsOptional()
    name?:string

    // Agregar propiedades que se esperan en el servicio corregido
    @IsOptional()
    city?: string;

    @IsOptional()
    specialist?: string;

    @IsOptional()
    service?: string;
}