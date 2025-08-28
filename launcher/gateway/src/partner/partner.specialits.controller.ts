import { Body, Controller, Delete,  Get, Inject, Param,  Post, Put } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { create_specialist_dto } from './dto/Specialists-Dto';
import { specialist_dto } from './dto/Specialists-Dto/specialist_dto';



@Controller('partner-specialits')
export class PartnerControllerSpecialits {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }



  @Post('specialist')
  create_specialit(@Body() create_specialist_dto: create_specialist_dto) {
    return this.client.send('create.specialist.partner', create_specialist_dto).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Put('specialist')
  update_specialit(@Body() specialist_dto: specialist_dto) {
    return this.client.send('update.specialist.partner', specialist_dto).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
  @Delete('specialist/:id')
  delete_specialist(@Param('id') id: string) {
    return this.client.send('delete.specialist.partner', { id }).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Get('specialist')
  get_all_specialits() {
    return this.client.send('all.specialist.partner', {}).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  






}


