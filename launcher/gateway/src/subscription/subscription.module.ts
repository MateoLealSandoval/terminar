import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_SERVERS?.split(',') || ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}