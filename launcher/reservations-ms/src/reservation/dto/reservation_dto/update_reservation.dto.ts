import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class updateReservationDto {

    @IsString()
    id: string;
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsString()
    userId: string;

    @IsString()
    idshedule: string;
}
