import { IsString } from "class-validator";

export class Update_user_partner_photo {
   
    @IsString()
    id: string
    
    @IsString()
    perfil_photo:string

     

}