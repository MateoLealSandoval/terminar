import { Type } from "class-transformer";
import { IsBoolean, IsString, ValidateNested, IsArray } from "class-validator";

export class SheduleItemCompleteId {
    @IsString()
    id: string;

    @IsBoolean()
    active: boolean;
}

export class PutSheduleItemsOfficeDto {
    @IsString()
    officeId: string;

    @IsArray()
    @ValidateNested({ each: true }) // ✅ Valida cada elemento del array
    @Type(() => SheduleItemCompleteId) 
    items: SheduleItemCompleteId[];
}
