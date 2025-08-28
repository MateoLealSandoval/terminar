import { IsString } from "class-validator"
import { PaginationDto } from "src/commont/pagination.dto"

export class pagination_favorites extends PaginationDto{
    @IsString()
    idUser:string
    
    

}