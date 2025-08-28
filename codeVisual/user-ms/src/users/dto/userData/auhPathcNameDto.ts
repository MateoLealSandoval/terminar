import { IsString } from 'class-validator';

export class auhPathcNameDto {
  @IsString()
  names: string;

  @IsString()
  lastnames: string;

  @IsString()
  id: string;
}