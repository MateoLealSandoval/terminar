import { IsOptional, IsString } from "class-validator";

export class photos_dto_body {
    @IsString()
    @IsOptional()
    idUser?: string; // Hacer opcional para compatibilidad

    @IsString()
    @IsOptional()
    userId?: string; // Agregar userId como alternativa

    @IsString()
    url: string;
}

export class clear_data {
    @IsString()
    id: string;

    @IsString()
    idUser: string;
}