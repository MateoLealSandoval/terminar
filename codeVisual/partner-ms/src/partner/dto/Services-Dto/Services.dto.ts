import { SpecialistStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";


export class ServicesDto {
    @IsString()
    name: string;

 
    @IsNumber()
    price:number
}
export class putServiceDto {
    @IsNumber()
    price:number 

    @IsString()
    id:string;

    @IsString()
    idUser:string;
}