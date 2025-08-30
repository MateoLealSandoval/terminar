import { Controller, Post, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Controller('reminders')
export class RemindersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('send-daily')
  async sendDailyReminders() {
    try {
      return await firstValueFrom(
        this.client.send('emails-ms.send.daily.reminders', {})
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('status')
  async getStatus() {
    try {
      return await firstValueFrom(
        this.client.send('emails-ms.reminder.status', {})
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}