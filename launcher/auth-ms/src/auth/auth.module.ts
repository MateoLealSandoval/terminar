import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NATS_SERVICE } from 'src/config';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'EstoEsUnStringSeguroParaJWT2024',
      signOptions: { expiresIn: '24h' },
    }),
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222'],
        },
      },
    ]),
    SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
