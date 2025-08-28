import { IsString } from "class-validator";

export class SetStatusPartnerDto {
  @IsString()
  id: string;

  @IsString()
  status: "USER_PARTNER" | "DELETED_USER_PARTNER";
}
