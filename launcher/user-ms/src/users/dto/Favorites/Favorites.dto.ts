 
import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

export class Favorites_dto {
 
  @IsString()
  userId: string;

  @IsString() // Necesario para identificar al usuario
  ProfessionalId: string;
 
    
}





