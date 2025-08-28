import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Query, Res, UseGuards, } from '@nestjs/common';


import { catchError, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';


import { PaginationDto } from 'src/commont/pagination.dto';
import { create_supcription_dto } from './dto/supcription/supcription.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { User } from 'src/auth/decorator';
import { AuthGuard } from 'src/guards/authGuards';

@Controller('supcription')
export class SupcriptionsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }



  @Get()
  @UseGuards(AuthGuard)
  Get_Notifications(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    // {...pagination, idUser: user.id 
    return this.client.send('emails-ms.get.subscriber.users.admin', pagination).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  edit_supcript(
    @User() user: CurrentUser,
    @Param('id') id: string,
    @Body() create_supcription_dto: create_supcription_dto,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    if (!create_supcription_dto) {
      throw new BadRequestException('No data provided in body');
    }
    const senddata = {
      ...create_supcription_dto,
      id: id,
    };
    console.log(senddata)
    return this.client.send('emails-ms.update.subscriber.user', senddata).pipe(
      catchError((error) => {
        return throwError(() => new RpcException(error));
      }),
    );
  }


  @Delete('/:id')
  @UseGuards(AuthGuard)
  delete_supcript(@User() user: CurrentUser, @Param('id') id: string) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }


    return this.client.send('emails-ms.delete.subscriber.user', { id: id }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @Post()
  create_supcriptor(@Body() create_supcription_dto: create_supcription_dto) {

    return this.client.send('emails-ms.create.subscriber.user', create_supcription_dto).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      }));
  }

  @Post('excel')
  @UseGuards(AuthGuard)
  async get_supcriptions(@User() user: CurrentUser, @Res() res: Response) {

    try {
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        throw new ForbiddenException('Access denied');
      }
      const data = await this.client.send('emails-ms.get.excel.data.admin', {}).toPromise();
      // Crear el Excel con ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Suscripciones');
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Fecha de creación', key: 'createdAt', width: 25 }
      ];
      data.data.forEach(sub => {
        worksheet.addRow({
          id: sub.id,
          name: sub.name,
          email: sub.email,
          createdAt: new Date(sub.createdAt).toISOString()
        });
      });

      // Configurar headers de respuesta HTTP
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=suscripciones.xlsx');
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generando Excel' });
    }
  }
  @Put()
  update_supcription(@Body() create_supcription_dto: create_supcription_dto) {
    return this.client.send('emails-ms.update.supcription', create_supcription_dto).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }
}
