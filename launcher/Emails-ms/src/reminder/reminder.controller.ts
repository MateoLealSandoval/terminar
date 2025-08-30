import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReminderCronService } from '../cron/reminder-cron.service';

@Controller()
export class ReminderController {
  constructor(private readonly reminderCronService: ReminderCronService) {}

  @MessagePattern('emails-ms.send.daily.reminders')
  async sendDailyReminders() {
    try {
      const result = await this.reminderCronService.sendRemindersManually();
      return {
        status: 200,
        message: 'Recordatorios enviados exitosamente',
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error enviando recordatorios',
        error: error.message,
      };
    }
  }

  @MessagePattern('emails-ms.reminder.status')
  async getStatus() {
    return {
      status: 200,
      message: 'Sistema de recordatorios activo',
      timezone: 'America/Bogota',
      schedule: '09:00 AM diario',
    };
  }
}
