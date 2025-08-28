import { IsNumber, IsString } from "class-validator";
 
export class Office_dto   {
   @IsString()
   title: string

   @IsString()
   description: string

   @IsNumber()
   longitude: number

   @IsNumber()
   latitude: number

   @IsString()
   nameCity:string
   @IsString()
   departament:string
}

