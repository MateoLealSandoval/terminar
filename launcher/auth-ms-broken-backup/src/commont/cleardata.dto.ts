import { IsString } from "class-validator"

export class clear_data {
    @IsString()
    id: string
    @IsString()
    idUser: string
}
