 
import { Type } from "class-transformer";
import {   IsArray, IsBoolean, IsIn, IsInt, IsPositive, IsString, Matches, Min, ValidateNested } from "class-validator";


export class ScheduleItemDto {
    @IsString()
    @IsIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
    day: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "El formato debe ser HH:mm (24 horas)"
    })
    openTime: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "El formato debe ser HH:mm (24 horas)"
    })
    closeTime: string;
}
export class sheduleItemDtoComplete extends ScheduleItemDto{
    @IsBoolean()
    active:boolean
}

export class ShedulesDto {
    @IsString()
    officeId: string;

    @ValidateNested()
    @Type(() => ScheduleItemDto)
    schedules: ScheduleItemDto;

    @IsInt()
    @IsPositive()
    @Min(5, { message: "El intervalo debe ser de al menos 5 minutos" })
    intervalMinutes: number;
}
export class pushSheduleList{
    @IsString()
    @IsIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
    day: string;
    @IsString()
    officeId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => sheduleItemDtoComplete)
    schedules:sheduleItemDtoComplete[];
 

}