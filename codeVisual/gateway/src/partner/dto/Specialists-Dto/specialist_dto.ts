import { IsEnum, IsString } from "class-validator";
import { state_specialist } from "src/partner/enums";
 

export class specialist_dto {
 
    @IsString()
    id:string;

    @IsString()
    name:string;

    @IsEnum(state_specialist)
    status:state_specialist;

    

}

export class PrepagadasId_dto{
    @IsString()
    id:string;

    @IsString()
    name:string;

    @IsEnum(state_specialist)
    status:state_specialist;
}