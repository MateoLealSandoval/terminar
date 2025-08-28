import { IsArray, IsOptional, IsString } from "class-validator";
import { PrepagadasId_dto, specialist_dto } from "./Specialists-Dto/specialist_dto";


export class Create_user_partner {

    @IsString()
    id: string
    @IsString()
    names: string;

    @IsString()
    lastnames: string;

    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    web?: string

    @IsOptional()
    @IsString()
    facebook?: string

    @IsOptional()
    @IsString()
    instagram?: string

    @IsOptional()
    @IsString()
    linkedin?: string

    @IsOptional()
    @IsString()
    youtube?: string

    @IsOptional()
    @IsString()
    perfilPhoto?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    document?: string

    @IsOptional()
    @IsString()
    phone?: string


    @IsOptional()
    specialists: specialist_dto[]

    @IsOptional()
    prepagadas: PrepagadasId_dto[]

    @IsOptional()
    type_of_payment: string

   

    @IsOptional()
    @IsArray()
    actions?: string[];

    @IsOptional()
    experience?: number;
}