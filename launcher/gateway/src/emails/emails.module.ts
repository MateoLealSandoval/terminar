import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { NatsModule } from 'src/transport/nast.module';
import { NotificationsController } from './notifications.controller';
import { SupcriptionsController } from './supcription.controller';
import { RemindersController } from './reminders.controller';

@Module({
  controllers: [EmailsController, NotificationsController, SupcriptionsController, RemindersController],
  imports: [NatsModule]
})
export class EmailsModule {}