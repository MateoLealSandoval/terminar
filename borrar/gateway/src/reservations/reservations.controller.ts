import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { create_reservation_dto } from './dto/reservation_dto';
import { AuthGuard } from 'src/guards/authGuards';
import { CalificationUserDto, CalificationUserDtoBody } from './dto/calification';
import { updateReservationDto, updateReservationDtoBody } from './dto';


@Controller('reservations-calendar')
export class ReservationsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }


  @Post()
  @UseGuards(AuthGuard)
  async create_reservation(@User() user: CurrentUser, @Body() create_reservation_dto: create_reservation_dto) {
    try {
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

      // Enviar la solicitud para crear el horario de la reserva
      return firstValueFrom(
        this.client.send('create.reservation.user', sendData)
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  async update_reservation(@Body() updateReservation_dtoBody: updateReservationDtoBody, @User() user: CurrentUser) {
    const updateReservation_dto: updateReservationDto = {
      ...updateReservation_dtoBody,
      userId: user.id
    };
    // Enviar la solicitud para crear el horario de la reserva
    return firstValueFrom(
      this.client.send('reservations-ms.update.reservation.id', updateReservation_dto).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        })
      )
    );

  }


  @Get('reservation/partner/:id')
  @UseGuards(AuthGuardParnet)
  async getreservationPartner(
    @User() user: CurrentUser,
    @Param('id') id: string) {
    try {
      return firstValueFrom(
        this.client.send('reservations-ms.get.reservation.id.partner', { id, idpartner: user.id })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async get_reservation_user(@User() user: CurrentUser) {
    try {
      if (user.role != 'USER') {
        throw new ForbiddenException('Acceso denegado. Solo usuarios pueden ver reservas.');
      }

      // Enviar la solicitud para crear el horario de la reserva
      return firstValueFrom(
        this.client.send('reservation.get.user.reservation', { id: user.id })
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Get('profeccional')
  @UseGuards(AuthGuardParnet)
  async get_profeccional_reservations(@User() user: CurrentUser) {
    try {
      // Enviar la solicitud para crear el horario de la reserva
      return firstValueFrom(
        this.client.send('reservation.get.profeccional.reservation', { id: user.id })
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Put('check-reservation-expired')
  async check_reservation_expired() {
    try {
      // Enviar la solicitud para crear el horario de la reserva
      return firstValueFrom(
        this.client.send('check.reservation.expired', {})
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('calification')
  @UseGuards(AuthGuard)
  async calification_reservation_by_user(@User() user: CurrentUser, @Body() databody: CalificationUserDtoBody) {
    try {
      const data: CalificationUserDto = {
        idUser: user.id,
        reservationId: databody.reservationId,
        idProfeccional: databody.idProfeccional,
        recommends: databody.recommends,
        service_specialist: databody.service_specialist,
        recomendations_specialist: databody.recomendations_specialist,
        personal_attention: databody.personal_attention,
        quality: databody.quality,
        time_service: databody.time_service,
        time_waiting: databody.time_waiting,
        site: databody.site,
        ubication_and_comfort: databody.ubication_and_comfort,
        comment: databody.comment
      }
      return firstValueFrom(
        this.client.send('calification.reservation.by.user', data)
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Get('profeccional-calification/:id')
  async get_calification_profeccional(@Param('id') id: string) {
    try {
      return firstValueFrom(
        this.client.send('get.calification.score.by.profeccional', { id })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete('cancel/user/:id')
  @UseGuards(AuthGuard)
  async cancelReservation(@Param('id') id: string, @User() user: CurrentUser) {

    return firstValueFrom(
      this.client.send('cancel.reservation.by.user', {
        idUser: user.id,
        reservationId: id,
      }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        })
      )
    );



  }
  @Delete('cancel/professional/:id')
  @UseGuards(AuthGuardParnet)
  async cancelReservationProfessional(@Param('id') id: string, @User() user: CurrentUser) {
    try {
      return firstValueFrom(
        this.client.send('cancel.reservation.by.profeccional', { idProfeccional: user.id, reservationId: id })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }


}
