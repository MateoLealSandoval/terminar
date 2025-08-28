import { IsString } from "class-validator";

export class setStatusUserDto {
  @IsString()
  id: string;

  @IsString()
  status: "USER" | "DELETED_USER_PARTNER";
}
