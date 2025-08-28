import { IsEmail, IsString , Matches } from "class-validator";

export class RegisterPartnerDto{
    @IsString()
    names:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y una letra minúscula',
    })
    password: string;

    @IsString()
    lastnames:string;
    
    @IsString()
    phone:string;

    
    @IsString()
    document:string;

    @IsString()
    title:string;



    
    
}