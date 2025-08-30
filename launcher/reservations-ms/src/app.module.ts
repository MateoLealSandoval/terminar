import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationModule } from './reservation/reservation.module';
import { ReminderService } from './reminder/reminder.service';
import { ReminderController } from './reminder/reminder.controller';
import { ReminderCronService } from './reminder/reminder-cron.service';

@Module({
  imports: [ReservationModule, ScheduleModule.forRoot()],
  controllers: [ReminderController],
  providers: [ReminderService, ReminderCronService],
})
export class AppModule {}
