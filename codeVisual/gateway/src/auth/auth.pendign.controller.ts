import { Body, Controller, ForbiddenException, Get, Inject, Param, Post, Put, Query, UseGuards, } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/authGuards';
import { User } from './decorator';
import { CurrentUser } from './interfaces/current-user.interfaces';
import { filtersPendingDto } from './dto/filters_pendings.dto';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';


@Controller('auth-pending')
export class AuthControllerPending {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

    @Get('get-all-pendings')
    @UseGuards(AuthGuard)
    get_all_partner(@User() user: CurrentUser, @Query() pagination: filtersPendingDto) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.client.send('auth-ms.get.users.pendings', pagination).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }

    @Put('approve/:id')
    @UseGuards(AuthGuard)
    aprove_user(@User() user: CurrentUser, @Param('id') id: string) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.client.send('auth-ms.aprovate.user.pengins', {id}).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }

}
