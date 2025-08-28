import { IsString } from "class-validator";
import { PaginationDto } from "src/commont/pagination.dto";

export class NotificationDto{
    @IsString()
    title:string;
    @IsString()
    message:string;
    @IsString()
    userId:string;
}
export class getNotification extends PaginationDto{
    @IsString()
    idUser:string;
}