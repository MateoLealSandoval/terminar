import { Body, Controller, Get, Inject, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs/internal/operators/catchError';
import { firstValueFrom, throwError } from 'rxjs';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { get_shedules_office, PutSheduleItemsOfficeDto, ShedulesDto } from './dto';
import { classToPlain } from 'class-transformer';
 

@Controller('reservations')
export class ReservationShedulesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }
  @Get('example')
  example() {
    return this.client.send('offices.example.reservation', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Post()
  @UseGuards(AuthGuardParnet)
  async create_shedule(@User() user: CurrentUser, @Body() shedules: ShedulesDto) {
    try {
      const sentconfirm = {
        userId: user.id,
        id: shedules.officeId,
      };

    

      // Espera la confirmación antes de continuar
      const confirm_data = await firstValueFrom(
        this.client.send('confirm.offices.partner', sentconfirm)
      );


      if (!confirm_data || confirm_data.status !== 200 || !confirm_data.data) {
        throw new RpcException('No se pudo confirmar la oficina');
      }
      const cleanedShedules = classToPlain(shedules);
      // Enviar la solicitud para crear el horario de la reserva
      return firstValueFrom(
        this.client.send('offices.create.reservation.shedule', cleanedShedules)
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Put()
  @UseGuards(AuthGuardParnet)
  async put_items_shedules(@User() user: CurrentUser, @Body() put_shedule_items_office_dto: PutSheduleItemsOfficeDto) {
    try {
      const sentconfirm = {
        userId: user.id,
        id: put_shedule_items_office_dto.officeId,
      };
      const confirm_data = await firstValueFrom(
        this.client.send('confirm.offices.partner', sentconfirm)
      );


      if (!confirm_data || confirm_data.status !== 200 || !confirm_data.data) {
        throw new RpcException('No se pudo confirmar la oficina');
      }
    
      return firstValueFrom(
        this.client.send('put.shedule.items.office.shedule', put_shedule_items_office_dto)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Get()
  async get_shedule_day(@Query('day') day: string,
    @Query('officeId') officeId: string) {
    try {
      if (!day || !officeId) {
        throw new RpcException({
          status: 400,
          message: "Los parámetros 'day' y 'officeId' son obligatorios."
        });
      }
      return firstValueFrom(
        this.client.send('get.offices.shedules.day', {
          officeId: officeId,
          day: day
        })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Post('/search-day')
  async get_shedule_search_day(@Body() get_shedules_office: get_shedules_office) {
    try {
      return firstValueFrom(
        this.client.send('get.days.office.shedule', get_shedules_office)
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }


}
