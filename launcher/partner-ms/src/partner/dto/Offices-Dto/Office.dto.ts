import { IsString } from "class-validator";
import { Create_office_dto } from "./Create.Office.dto";

export class Office_dto extends Create_office_dto {
   @IsString()
   id:string
   
}

