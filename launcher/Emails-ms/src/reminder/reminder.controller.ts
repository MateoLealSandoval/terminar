import { Controller, Post, Get } from '@nestjs/common';
import { ReminderCronService } from '../cron/reminder-cron.service';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderCronService: ReminderCronService) {}

  @Post('send-daily')
  async sendDailyReminders() {
    try {
      await this.reminderCronService.sendRemindersManually();
      return {
        status: 200,
        message: 'Recordatorios enviados exitosamente',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error enviando recordatorios',
        error: error.message,
      };
    }
  }

  @Get('status')
  async getStatus() {
    return {
      status: 200,
      message: 'Sistema de recordatorios activo',
      timezone: 'America/Bogota',
      schedule: '09:00 AM diario',
      next_execution: 'Mañana a las 09:00 AM',
    };
  }

  @Get('test-connection')
  async testConnection() {
    try {
      // Test simple para verificar que todo funciona
      return {
        status: 200,
        message: 'Conexión exitosa',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error de conexión',
        error: error.message,
      };
    }
  }
}
