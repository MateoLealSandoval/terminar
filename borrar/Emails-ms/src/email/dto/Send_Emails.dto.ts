import { IsEmail, IsString} from "class-validator";

export class SendEmailsDto {
    @IsString()
    names:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    subject: string;

    @IsString()
    text:string;
    
    
}