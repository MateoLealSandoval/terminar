import { IsString } from "class-validator";

export class city_dto {
 
    @IsString()
    id:string;

    @IsString()
    name:string;

 

}