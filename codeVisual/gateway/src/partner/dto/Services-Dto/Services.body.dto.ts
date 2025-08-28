import { IsString } from "class-validator";
import { ServicesDto } from "./Services.dto";

export class ServicesDtoBody  extends ServicesDto{
    @IsString()
    idUser: string;

  
}