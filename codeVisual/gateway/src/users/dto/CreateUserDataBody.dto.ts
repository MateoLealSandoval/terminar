import { IsString, IsEnum, IsNumber, IsOptional, IsInt, IsEmail } from "class-validator";
// Definir el enum correctamente


export class CreateUserDataBodyDto {
    @IsString()
    names: string;

    @IsString()
    lastnames: string;
    @IsOptional()
    @IsString()
    perfilPhoto?: string;

    @IsOptional()
    @IsInt()
    birthDay?: number;

    @IsOptional()
    @IsInt()
    birthMonth?: number;

    @IsOptional()
    @IsInt()
    birthYear?: number;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @IsOptional()
    @IsString()
    contactNames?: string;

    @IsOptional()
    @IsString()
    contactLastnames?: string;

    @IsOptional()
    @IsString()
    contactPhone?: string;


    @IsOptional()
    @IsString()
    sex?: string;

    @IsOptional()
    @IsString()
    familly?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    cityuser?: string;

    @IsOptional()
    @IsString()
    country?: string;
}


