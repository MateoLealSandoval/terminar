import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/auth/commont/pagination.dto";
type StatusType = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export class filtersPendingDto extends PaginationDto {
    @IsOptional()
    
    @IsIn(['ACCEPTED', 'PENDING', 'REJECTED'], {
        message: 'el tipo debe ser uno de los siguientes: pendiente, aceptado, rechazado',
    })
    type?: StatusType

}