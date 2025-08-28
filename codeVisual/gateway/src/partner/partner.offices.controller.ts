import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { Create_office_dto, Office_dto } from './dto/Offices-Dto';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { User } from 'src/auth/decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';

@Controller('partner-offices')
export class PartnerOfficesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('example')
  example(){
    return "example"
  }

  @Post('add')
  @UseGuards(AuthGuardParnet)
  create_specialit(@User() user: CurrentUser,@Body() Office_dto:Office_dto ) {
    const add_office_partner:Create_office_dto={
      idUser:user.id,
      description:Office_dto.description,
      latitude:Office_dto.latitude,
      longitude:Office_dto.longitude,
      title:Office_dto.title,
      departament:Office_dto.departament,
      nameCity:Office_dto.nameCity
    }
    return this.client.send('add.offices.partner', add_office_partner ).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Get('citys')
  get_citys(){
    return this.client.send('get.citys.offices.partner',{} ).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
}


