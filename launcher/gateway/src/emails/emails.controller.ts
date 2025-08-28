import { Body, Controller, Get, Inject, Post, Put, UseGuards } from '@nestjs/common';

import { create_reservation_dto } from './dto/create_reservatio_token.dto';
import { catchError, defaultIfEmpty, firstValueFrom, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/authGuards';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { RegisterUserDto } from 'src/auth/dto';
import { SendEmailsDto } from './dto/Send_Emails.dto';

@Controller('emails')
export class EmailsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @UseGuards(AuthGuard)
  @Post('reservation')
  async create_reservation_token(@User() user: CurrentUser, @Body() create_reservation_dto: create_reservation_dto) {

    const sentconfirm = {
      userId: create_reservation_dto.profecionalId,
      id: create_reservation_dto.officeId,
    };
    // Espera la confirmación antes de continuar
    const confirm_data = await firstValueFrom(
      this.client.send('confirm.offices.partner', sentconfirm)
    );


    if (!confirm_data || confirm_data.status !== 200 || !confirm_data.data) {
      throw new RpcException('No se pudo confirmar la oficina');
    }

    const sendData = {
      ...create_reservation_dto,
      userId: user.id
    }
    return this.client.send('create.reservation.token.email', sendData).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @UseGuards(AuthGuard)
  @Post('confirm')
  confirm_reservation(@User() user: CurrentUser, @Body() dataBody: { token: string; code: number }) {
    const payload = {
      userId: user.id,
      token: dataBody.token,
      code: dataBody.code,
    };
    return this.client.send('confirm.reservation.token.email', payload).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Post('reset-password')
  reset_password(@Body() databody: { email: string }) {
    return this.client.send('create.reset.password.user', { email: databody.email }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Put('reset-password/confirmtoken')
  confirm_new_password(@Body() databody: { token: string, password }) {
    return this.client.send('update.reset.password.user', { token: databody.token, password: databody.password }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }



  @Post('send-email-all')
  send_email_all(@Body() SendEmailsDto: SendEmailsDto) {
    return this.client.send('email-ms.send.email.all', SendEmailsDto).pipe(
      defaultIfEmpty(null),  // si no hay valor emitido, emitirá null
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

}
