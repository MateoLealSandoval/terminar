import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';
import { ReminderCronService } from './cron/reminder-cron.service';

@Module({
  imports: [EmailModule, ScheduleModule.forRoot()],
  providers: [ReminderCronService], // Solo el CronService aquí
})
export class AppModule {}
