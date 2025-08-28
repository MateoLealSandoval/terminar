
import { IsEnum, IsIn, IsString } from "class-validator";

export class get_shedules {

    @IsString()
    officeId: string;
    @IsString()
    @IsIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
    day: string;
}
