
import { Type } from "class-transformer";
import { IsArray,   IsIn, IsString, ValidateNested } from "class-validator";

export class get_shedules_office {

    @IsString()
    officeId: string;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Get_shedule_date)
    Get_shedule_date: Get_shedule_date[];
}

export class Get_shedule_date{
    @IsString()
    @IsIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
    day: string;


    @IsString()
    date: string; // Se espera en formato YYYY-MM-DD
}