import { IsInt, IsString } from "class-validator";


export class CalificationUserDto {
    @IsString()
    idUser: string;
    @IsString()
    reservationId: string;
    @IsString()    
    idProfeccional: string;
    @IsInt()
    recommends: number;
    @IsInt()
    service_specialist: number;
    @IsInt()
    recomendations_specialist: number;
    @IsInt()
    personal_attention: number;
    @IsInt()
    quality: number;
    @IsInt()
    time_service: number;
    @IsInt()
    time_waiting: number;
    @IsInt()
    site: number;
    @IsInt()
    ubication_and_comfort: number
    @IsString()
    comment: string;
}