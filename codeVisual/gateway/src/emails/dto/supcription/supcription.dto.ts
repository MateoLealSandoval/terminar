import {   IsEmail,    IsString } from "class-validator";

export class create_supcription_dto {
    @IsString()
    @IsEmail()
    email:string

    @IsString()
    name:string
}
 