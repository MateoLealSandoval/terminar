import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendEmailsDto {
  @IsString()
  names: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  to?: string; // Campo adicional para compatibilidad con código existente
}
