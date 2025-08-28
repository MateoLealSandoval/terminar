import { Body, Controller, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { create_reservation_dto } from './dto/create_reservatio_token.dto';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/authGuards';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { PaginationDto } from 'src/commont/pagination.dto';


@Controller('notification')
export class NotificationsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }


  @UseGuards(AuthGuard)
  @Get()
  Get_Notifications(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    return this.client.send('get.notifications.user', { ...pagination, idUser: user.id }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
  @UseGuards(AuthGuard)
  @Get('pendings')
  get_notification_pendings(@User() user: CurrentUser) {
    return this.client.send('get.notifications.pendings.user.number', { id: user.id }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  get_notification_id(@User() user: CurrentUser, @Param('id') id: string) {
    return this.client.send('get.notification.id.user', { id: id, idUser: user.id })
  }




}
