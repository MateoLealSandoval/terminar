import { IsDateString, IsEmail, IsNumber, IsString } from "class-validator";

export class create_reservation_dto{

    @IsString()
    officeId: string;
    @IsString()
    scheduleId: string;

    @IsDateString()
    date: string;

    // @IsString()
    // userId:string;

    @IsString()
    profecionalId:string;

    @IsNumber()
    price:number
   
    @IsString()
    payment:string
}