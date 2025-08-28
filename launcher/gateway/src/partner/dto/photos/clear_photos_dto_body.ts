import { IsString } from "class-validator"
 

export class clear_photos_dto_body {
    @IsString()
    id: string
    @IsString()
    idUser: string
}
