import { Controller, Post, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Controller('reminders')
export class RemindersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('send-daily')
  async sendDailyReminders() {
    return this.client.send('emails.reminders.send-daily', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Get('status')
  async getRemindersStatus() {
    return this.client.send('emails.reminders.status', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Get('test-connection')
  async testConnection() {
    return this.client.send('emails.reminders.test-connection', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
}