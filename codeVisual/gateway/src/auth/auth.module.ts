import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transport/nast.module';
import { AuthControllerPending } from './auth.pendign.controller';

@Module({
  controllers: [AuthController,AuthControllerPending],
  imports:[NatsModule],
})
export class AuthModule {}
