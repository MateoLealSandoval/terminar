import { IsString } from "class-validator";

export class photos_dto {
        @IsString()
        url:string
}


