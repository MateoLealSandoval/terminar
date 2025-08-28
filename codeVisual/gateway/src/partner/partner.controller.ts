import { Body, Controller, FileTypeValidator, Get, Inject, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { Create_user_partner, Create_user_partner_body } from './dto';
import { AuthGuardParnet } from 'src/guards/authGuardsParnet';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { filters_specialist_dto } from './dto/Specialists-Dto/filters_specialits.dto';
import { PaginationDto } from 'src/commont/pagination.dto';



@Controller('partner')
export class PartnerController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }


  @Get('example')
  example() {
    return this.client.send('user.example.partner', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
  @Post('specialist')
  @UseGuards(AuthGuardParnet)
  create_update_partner(@User() user: CurrentUser, @Body() Create_user_partner: Create_user_partner_body) {
    const update_partner: Create_user_partner = {

      id: user.id,
      names: Create_user_partner.names,
      lastnames: Create_user_partner.lastnames,
      description: Create_user_partner.description,
      document: Create_user_partner.document,
      facebook: Create_user_partner.facebook,
      instagram: Create_user_partner.instagram,
      perfilPhoto: Create_user_partner.perfilPhoto,
      linkedin: Create_user_partner.linkedin,
      phone: Create_user_partner.phone,
      title: Create_user_partner.title,
      web: Create_user_partner.web,
      youtube: Create_user_partner.youtube,
      specialists: Create_user_partner.specialists,
      prepagadas: Create_user_partner.prepagadas,
      type_of_payment: Create_user_partner.type_of_payment,
      actions: Create_user_partner.actions,
      experience: Create_user_partner.experience
    }
    return this.client.send('update.partner.partner', update_partner).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }


  @Get('specialist/:id')
  get_partner_detail(@Param('id') id: string) {
    return this.client.send('get.partner.detail.user', { id }).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Post('filter')
  get_partner_filters(@Body() filters_specialist_dto: filters_specialist_dto, @Query() pagination: PaginationDto) {
    const filteredDto = Object.fromEntries(
      Object.entries(filters_specialist_dto).filter(([_, value]) => value !== undefined)
    );
    return this.client.send('get.partner.filters', {
      ...pagination,
      ...filteredDto
    }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }


  @Get('specialist-user')
  @UseGuards(AuthGuardParnet)
  get_partner_detail_my(@User() user: CurrentUser) {
    return this.client.send('get.partner.detail', { id: user.id }).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }



}


