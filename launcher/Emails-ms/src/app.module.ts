import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailModule } from './email/email.module';
import { envs, NATS_SERVICE } from './config';
import { ReminderController } from './reminder/reminder.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ReminderController],
  providers: [],
})
export class AppModule {}
