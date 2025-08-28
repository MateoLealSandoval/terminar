
import {   IsString } from "class-validator";

export class get_shedules {

    @IsString()
    officeId:string;
    
    @IsString()
    day: string;
}
