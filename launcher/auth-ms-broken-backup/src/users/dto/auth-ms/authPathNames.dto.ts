import { IsString } from "class-validator";
export class auhPathcNameDto {
    @IsString()
    id: string
    @IsString()
    names: string;
    @IsString()
    lastnames: string;
}