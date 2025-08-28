import { IsString } from "class-validator";

export class edit_reservation_to_partner_dto {

    @IsString()
    email: string;

    @IsString()
    message: string;

    @IsString()
    subject:string;

}

export class reservation_email_dto{
    @IsString()
    email: string;

    @IsString()
    message: string;

    @IsString()
    subject:string;
}