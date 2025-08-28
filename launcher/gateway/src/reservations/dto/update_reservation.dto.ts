import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class updateReservationDtoBody {

    @IsString()
    id: string;
    @IsDate()
    @Type(() => Date) 
    date: Date;
    @IsString()
    idshedule: string;
    
}

export class updateReservationDto extends updateReservationDtoBody {

    @IsString()
    userId: string;

}