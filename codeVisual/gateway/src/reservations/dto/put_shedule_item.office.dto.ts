import { IsArray, IsBoolean, IsIn, IsString, isString, ValidateNested } from "class-validator";
 
import { Type } from "class-transformer";

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
