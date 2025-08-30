import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReminderService } from './reminder.service';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);

  constructor(private reminderService: ReminderService) {}

  @Cron('0 9 * * *', { timeZone: 'America/Bogota' })
  async sendDailyReminders() {
    this.logger.log('Iniciando envío de recordatorios diarios...');

    try {
      const appointments =
        await this.reminderService.getAppointmentsForTomorrow();
      this.logger.log(`Encontradas ${appointments.length} citas para recordar`);

      let successCount = 0;

      for (const appointment of appointments) {
        try {
          // Solo marcar como enviado - el envío real se haría aquí
          await this.reminderService.markReminderSent(appointment.id);
          successCount++;
          this.logger.log(
            `Recordatorio procesado para reserva ${appointment.id}`,
          );
        } catch (error) {
          this.logger.error(
            `Error procesando reserva ${appointment.id}:`,
            error,
          );
        }
      }

      this.logger.log(`Procesados: ${successCount} recordatorios`);
      return { sent: successCount, failed: 0 };
    } catch (error) {
      this.logger.error('Error general:', error);
      throw error;
    }
  }

  async sendRemindersManually() {
    return await this.sendDailyReminders();
  }
}
