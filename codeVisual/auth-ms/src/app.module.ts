import { Module } from '@nestjs/common';
 

import { AuthModule } from './auth/auth.module';
import { RegisterProfessionalModule } from './register_professional/register_professional.module';
 
 
 
 

@Module({
  imports: [ AuthModule, RegisterProfessionalModule],

 
})
export class AppModule {}
