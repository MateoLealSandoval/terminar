import { Module } from '@nestjs/common';
import { RegisterProfessionalService } from './services/register_professional.service';
import { RegisterProfessionalController } from './controllers/register_professional.controller';
import { NatsModule } from 'src/transport/nast.module';

@Module({
  imports:[NatsModule],
  controllers: [RegisterProfessionalController],
  providers: [RegisterProfessionalService],
})
export class RegisterProfessionalModule {}
