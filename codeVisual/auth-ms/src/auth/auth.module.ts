import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { NatsModule } from '../transport/nast.module';

@Module({
  imports:[
    NatsModule,
    JwtModule.register({
      global:true,
      secret: envs.jwtSecret,
      signOptions:{expiresIn:'2d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  
 
})
export class AuthModule {}
