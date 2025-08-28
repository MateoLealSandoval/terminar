import { Body, Controller, Delete, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { clear_photos_dto_body, photos_dto, photos_dto_body } from './dto/photos';



@Controller('partner-photos')
export class PartnerPhotosController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }


  @Post()
  @UseGuards(AuthGuardParnet)
  add_photo_partner(@User() user: CurrentUser, @Body() photos_dto_body: photos_dto) {
    const send_data: photos_dto_body = {
      id: user.id,
      url: photos_dto_body.url
    }
    return this.client.send('add.partner.photos', send_data).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuardParnet)
  delete_photo_partner(@User() user: CurrentUser, @Param('id') id: string) {
    const send_data: clear_photos_dto_body = {
      id: id,
      idUser: user.id
    }
    return this.client.send('clear.partner.photos.panel', send_data).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

}


