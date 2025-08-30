import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReminderService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Obtener citas que necesitan recordatorio para mañana
  async getAppointmentsForTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    return await this.reservation.findMany({
      where: {
        date: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
        reminder_sent: false,
        status: 'ACTIVE',
      },
    });
  }

  // Marcar recordatorio como enviado
  async markReminderSent(reservationId: string) {
    return await this.reservation.update({
      where: { id: reservationId },
      data: {
        reminder_sent: true,
        reminder_sent_at: new Date(),
      },
    });
  }

  // Log de intento de recordatorio
  async logReminderAttempt(
    reservationId: string,
    email: string,
    status: 'SUCCESS' | 'FAILED',
    errorMessage?: string,
  ) {
    try {
      await this.$executeRaw`
                INSERT INTO reminder_logs (reservation_id, patient_email, status, error_message)
                VALUES (${reservationId}, ${email}, ${status}, ${errorMessage || null})
            `;
    } catch (error) {
      console.error('Error guardando log:', error);
    }
  }
}
