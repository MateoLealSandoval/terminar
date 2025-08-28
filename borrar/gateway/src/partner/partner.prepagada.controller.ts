import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { AuthGuard } from 'src/guards/authGuards';
import { PrepagadasDto } from './dto/prepagadas/prepagadas.dto';



@Controller('prepagada')
export class PartPrepagadaController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }


    @Post()
    @UseGuards(AuthGuard)
    createprepagadas(@User() user: CurrentUser, @Body() { datas }: { datas: PrepagadasDto[] }) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.client.send('partner-ms.create.prepagada', { datas: datas }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }

    @Get()
    getAllPrepagadas() {
        return this.client.send('partner-ms.get.prepagada', {  }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }



}


