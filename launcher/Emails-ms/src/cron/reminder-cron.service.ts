import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email/services/email.service.service';
import { NATS_SERVICE } from '../config';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);
  private prisma = new PrismaClient();

  constructor(
    private emailService: EmailService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  // Ejecutar todos los días a las 9:00 AM Colombia
  @Cron('0 9 * * *', {
    timeZone: 'America/Bogota',
  })
  async sendDailyReminders() {
    this.logger.log('🔔 Iniciando envío de recordatorios diarios...');

    try {
      // Obtener fecha de mañana
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Rango para todo el día de mañana
      const startOfTomorrow = new Date(tomorrow);
      startOfTomorrow.setHours(0, 0, 0, 0);

      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      // Buscar citas para mañana que no hayan recibido recordatorio
      const reservations = await this.prisma.reservation.findMany({
        where: {
          date: {
            gte: startOfTomorrow,
            lte: endOfTomorrow,
          },
          reminder_sent: false,
          status: 'ACTIVE',
        },
      });

      this.logger.log(
        `📋 Encontradas ${reservations.length} citas para recordar`,
      );

      let successCount = 0;
      let failureCount = 0;

      // Procesar cada reserva
      for (const reservation of reservations) {
        try {
          await this.sendReminderEmail(reservation);

          // Marcar como enviado
          await this.prisma.reservation.update({
            where: { id: reservation.id },
            data: {
              reminder_sent: true,
              reminder_sent_at: new Date(),
            },
          });

          // Log de éxito
          await this.logReminderAttempt(reservation.id, 'SUCCESS');
          successCount++;
        } catch (error) {
          this.logger.error(
            `❌ Error enviando recordatorio para reserva ${reservation.id}:`,
            error,
          );

          // Log de error
          await this.logReminderAttempt(
            reservation.id,
            'FAILED',
            error.message,
          );
          failureCount++;
        }
      }

      this.logger.log(
        `✅ Recordatorios procesados: ${successCount} exitosos, ${failureCount} fallidos`,
      );
    } catch (error) {
      this.logger.error('❌ Error general enviando recordatorios:', error);
    }
  }

  private async sendReminderEmail(reservation: any) {
    // Obtener datos del usuario
    const userData = await this.getUserData(reservation.userId);

    // Obtener datos del profesional y oficina
    const professionalData = await this.getProfessionalData(
      reservation.profecionalId,
      reservation.officeId,
    );

    const appointmentDate = new Date(reservation.date);

    // Formatear fecha y hora
    const formattedDate = appointmentDate.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = appointmentDate.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Generar HTML del recordatorio
    const reminderHtml = this.emailService.generateReminderEmailHtml({
      patientName: userData.names || 'Usuario',
      professionalName: professionalData.data?.name || 'Profesional DocVisual',
      appointmentDate: formattedDate,
      appointmentTime: formattedTime,
      location:
        professionalData.data?.address || 'Consulte la dirección en su cita',
      officeName: professionalData.data?.name || 'DocVisual',
      paymentMethod: reservation.payment,
    });

    // Enviar email
    await this.emailService.sendReminderEmail(
      userData.email,
      '🔔 Recordatorio: Tu cita es mañana - DocVisual',
      reminderHtml,
    );

    this.logger.log(
      `📧 Recordatorio enviado a: ${userData.email} para cita el ${formattedDate} a las ${formattedTime}`,
    );
  }

  private async getUserData(userId: string) {
    try {
      const userData = await firstValueFrom(
        this.client.send('get.user.by.id', { id: userId }),
      );
      return userData.data;
    } catch (error) {
      this.logger.error(`Error obteniendo datos de usuario ${userId}:`, error);
      return { names: 'Usuario', email: 'test@test.com' };
    }
  }

  private async getProfessionalData(profecionalId: string, officeId: string) {
    try {
      const professionalData = await firstValueFrom(
        this.client.send('get.id.office.and.partner', {
          id: profecionalId,
          idOffice: officeId,
        }),
      );
      return professionalData;
    } catch (error) {
      this.logger.error(
        `Error obteniendo datos de profesional ${profecionalId}:`,
        error,
      );
      return {
        data: {
          name: 'Profesional DocVisual',
          address: 'Consulte la dirección',
        },
      };
    }
  }

  private async logReminderAttempt(
    reservationId: string,
    status: 'SUCCESS' | 'FAILED',
    errorMessage?: string,
  ) {
    try {
      await this.prisma.$executeRaw`
                INSERT INTO reminder_logs (reservation_id, patient_email, status, error_message)
                VALUES (${reservationId}, 'system@docvisual.co', ${status}, ${errorMessage || null})
            `;
    } catch (error) {
      this.logger.error('Error guardando log de recordatorio:', error);
    }
  }

  // Método público para testing manual
  async sendRemindersManually() {
    this.logger.log('🔧 Ejecutando recordatorios manualmente...');
    await this.sendDailyReminders();
  }
}
