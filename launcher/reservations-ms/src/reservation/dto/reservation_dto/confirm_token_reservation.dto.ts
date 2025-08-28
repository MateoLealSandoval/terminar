import { IsString } from "class-validator";

export class confirm_token_reservation {

    @IsString()
    token: string;
    @IsString()
    confirm_User_ID: string;
}
