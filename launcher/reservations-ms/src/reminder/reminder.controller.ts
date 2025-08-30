import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReminderService } from './reminder.service';

@Controller()
export class ReminderController {
    constructor(private readonly reminderService: ReminderService) {}

    @MessagePattern('get.appointments.for.tomorrow')
    async getAppointmentsForTomorrow() {
        try {
            const appointments = await this.reminderService.getAppointmentsForTomorrow();
            
            return {
                status: 200,
                data: appointments,
                count: appointments.length
            };
        } catch (error) {
            return {
                status: 400,
                message: error.message,
                data: []
            };
        }
    }

    @MessagePattern('mark.reminder.sent')
    async markReminderSent(data: { reservationId: string }) {
        try {
            await this.reminderService.markReminderSent(data.reservationId);
            return {
                status: 200,
                message: 'Recordatorio marcado como enviado'
            };
        } catch (error) {
            return {
                status: 400,
                message: error.message
            };
        }
    }

    @MessagePattern('log.reminder.attempt')
    async logReminderAttempt(data: { 
        reservationId: string; 
        email: string; 
        status: 'SUCCESS' | 'FAILED'; 
        errorMessage?: string; 
    }) {
        try {
            await this.reminderService.logReminderAttempt(
                data.reservationId, 
                data.email, 
                data.status, 
                data.errorMessage
            );
            return {
                status: 200,
                message: 'Log guardado'
            };
        } catch (error) {
            return {
                status: 400,
                message: error.message
            };
        }
    }
}