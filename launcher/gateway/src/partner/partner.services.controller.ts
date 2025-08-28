import {  Body, Controller, Delete, Inject, Param,  Post,  Put,  UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { putService_body_dto, putServiceDto, ServicesDto, ServicesDtoBody } from './dto/Services-Dto';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { clear_data } from 'src/commont/cleardata.dto';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';



@Controller('services')
export class PartnerServicesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @UseGuards(AuthGuardParnet)
  create_services(@User() user: CurrentUser,@Body() ServicesDto: ServicesDto) {
    const newService: ServicesDtoBody = {
      idUser: user.id,
      name: ServicesDto.name,
      price: ServicesDto.price
    }
    return this.client.send('user.add.services.partner', newService).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Put()
  @UseGuards(AuthGuardParnet)
  update_services(@User() user: CurrentUser,@Body() body_put_service: putService_body_dto) {
    const edit_service: putServiceDto = {
      idUser: user.id,
      price: body_put_service.price,
      id:body_put_service.id
    }
    return this.client.send('user.put.services.partner', edit_service).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }


  @Delete('/:id')
  @UseGuards(AuthGuardParnet)
  delete_create_services(@User() user: CurrentUser, @Param('id') id: string) {
    const delete_data: clear_data = {
      id: id,
      idUser: user.id
    }
    return this.client.send('user.delete.services.partner', delete_data).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }
}


