
import {  IsNumber, IsString } from "class-validator";


export class ServicesDto {
    @IsString()
    name: string;

 
    @IsNumber()
    price:number
}

export class putService_body_dto{
    @IsNumber()
    price:number 

    @IsString()
    id:string;
}

export class putServiceDto {
    @IsNumber()
    price:number 

    @IsString()
    id:string;

    @IsString()
    idUser:string;
}
