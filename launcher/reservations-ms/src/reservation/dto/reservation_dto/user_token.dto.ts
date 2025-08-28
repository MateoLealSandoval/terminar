import { IsString } from "class-validator";

export class user_token_dto {

    @IsString()
    userId: string;
    @IsString()
    action: string;
}
