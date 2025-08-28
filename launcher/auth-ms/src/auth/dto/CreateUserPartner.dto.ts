import { IsString } from "class-validator";


export class CreateUserPartnerDto {
    
    @IsString()
    id:string
 
    @IsString()
    phone:string;

    @IsString()
    title:string;

    @IsString()
    document:string;  

}