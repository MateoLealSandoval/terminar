import { IsString } from "class-validator";

export class create_specialist_dto {
 

    @IsString()
    name:string;

   

    

}