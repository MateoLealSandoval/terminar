import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email/services/email.service.service';
import { NATS_SERVICE } from '../config';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);

  constructor(
    private emailService: EmailService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Cron('0 9 * * *', { timeZone: 'America/Bogota' })
  async sendDailyReminders() {
    this.logger.log('Iniciando envío de recordatorios diarios...');

    try {
      const appointmentsResponse = await firstValueFrom(
        this.client.send('get.appointments.for.tomorrow', {})
      );

      if (appointmentsResponse.status !== 200) {
        throw new Error('Error obteniendo citas');
      }

      const reservations = appointmentsResponse.data;
      this.logger.log(`Encontradas ${reservations.length} citas para recordar`);

      let successCount = 0;
      let failureCount = 0;

      for (const reservation of reservations) {
        try {
          await this.sendReminderEmail(reservation);
          
          await firstValueFrom(
            this.client.send('mark.reminder.sent', { 
              reservationId: reservation.id 
            })
          );

          successCount++;
        } catch (error) {
          this.logger.error(`Error en reserva ${reservation.id}:`, error);
          failureCount++;
        }
      }

      this.logger.log(`Enviados: ${successCount}, Fallidos: ${failureCount}`);
      return { sent: successCount, failed: failureCount };
      
    } catch (error) {
      this.logger.error('Error general:', error);
      throw error;
    }
  }

  private async sendReminderEmail(reservation: any) {
    const userData = await this.getUserData(reservation.userId);
    const professionalData = await this.getProfessionalData(reservation.profecionalId, reservation.officeId);

    const appointmentDate = new Date(reservation.date);
    const formattedDate = appointmentDate.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = appointmentDate.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const reminderHtml = this.emailService.generateReminderEmailHtml({
      patientName: userData.names || 'Usuario',
      professionalName: professionalData.data?.name || 'Profesional',
      appointmentDate: formattedDate,
      appointmentTime: formattedTime,
      location: professionalData.data?.offices?.[0]?.description || 'Consulte dirección',
      officeName: professionalData.data?.name || 'DocVisual',
      paymentMethod: reservation.payment
    });

    await this.emailService.sendReminderEmail(
      userData.email,
      'Recordatorio: Tu cita es mañana - DocVisual',
      reminderHtml
    );

    this.logger.log(`Recordatorio enviado a: ${userData.email}`);
  }

  private async getUserData(userId: string) {
    try {
      const userData = await firstValueFrom(
        this.client.send('get.user.by.id', { id: userId })
      );
      return userData.data;
    } catch (error) {
      return { names: 'Usuario', email: 'h2comunicacion2018@gmail.com' };
    }
  }

  private async getProfessionalData(profecionalId: string, officeId: string) {
    try {
      const professionalData = await firstValueFrom(
        this.client.send('get.id.office.and.partner', { 
          id: profecionalId, 
          idOffice: officeId 
        })
      );
      return professionalData;
    } catch (error) {
      return { 
        data: { 
          name: 'Profesional DocVisual', 
          offices: [{ description: 'Consulte dirección' }]
        } 
      };
    }
  }

  async sendRemindersManually() {
    return await this.sendDailyReminders();
  }
}