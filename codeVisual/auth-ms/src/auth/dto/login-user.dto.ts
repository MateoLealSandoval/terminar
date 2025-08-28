import { IsEmail, IsString, Matches } from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y una letra minúscula',
    })
    password: string;
}