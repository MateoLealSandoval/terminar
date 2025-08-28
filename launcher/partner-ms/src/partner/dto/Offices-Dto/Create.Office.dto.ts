import { IsNumber, IsString } from "class-validator";

export class Create_office_dto {

    @IsString()
    idUser:string

    @IsString()
    title : string

    @IsString()
    description:string
    
    @IsNumber()
    longitude:number

    @IsNumber()
    latitude:number

    @IsString()
    nameCity:string
    @IsString()
    departament:string
}

