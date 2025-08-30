import { Module } from '@nestjs/common';
import { ReservationModule } from './reservation/reservation.module';
import { ReminderService } from './reminder/reminder.service';
import { ReminderController } from './reminder/reminder.controller';

@Module({
  imports: [ReservationModule],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class AppModule {}
