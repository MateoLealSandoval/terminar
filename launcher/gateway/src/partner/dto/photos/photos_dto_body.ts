import { IsString } from "class-validator";
import { photos_dto } from "./photos_dto";

export class photos_dto_body extends photos_dto{
    @IsString()
    id: string
}