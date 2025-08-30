import { Body, Controller, ForbiddenException, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, throwError } from 'rxjs';
import { AuthGuard } from 'src/guards/authGuards';
import { Token, User } from './decorator';
import { CurrentUser } from './interfaces/current-user.interfaces';

// Interfaces (simplificadas para evitar errores de import)
interface LoginUserDto { email: string; password: string; }
interface RegisterUserDto { email: string; password: string; names: string; lastnames: string; }
interface RegisterPartnerDto extends RegisterUserDto { document: string; phone: string; title: string; }
interface PaginationDto { page?: number; limit?: number; }
interface SetStatusPartnerDto { id: string; status: string; }
interface setStatusUserDto { id: string; status: string; }

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() RegisterUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', RegisterUserDto).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Post('register-super-admin')
  registerSuperAdmin(@Body() RegisterUserDto: RegisterUserDto) {
    return this.client.send('auth-ms.create.user.superadmin', RegisterUserDto).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Post('registerpartner')
  registerPartner(@Body() RegisterPartnerDto: RegisterPartnerDto) {
    return this.client.send('auth.register.partner', RegisterPartnerDto).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Post('login')
  loginUser(@Body() LoginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', LoginUserDto).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Post('login-partner')
  loginPartner(@Body() LoginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', LoginUserDto).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return this.client.send('auth.verify.user.data.token', token);
  }

  @Get('get-all-partner')
  @UseGuards(AuthGuard)
  get_all_partner(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.get.all.partner.pagination.admin', pagination).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Get('panel-data-users')
  @UseGuards(AuthGuard)
  get_users_data(@User() user: CurrentUser) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.information.users.admin', { id: user.id }).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Get('get-all-users')
  @UseGuards(AuthGuard)
  get_all_users(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.get.all.user.pagination.admin', pagination).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Patch('update-users/:id')
  @UseGuards(AuthGuard)
  update_user_status(@User() user: CurrentUser, @Param('id') id: string, @Body() body: { status: string }) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    if (body.status !== "USER" && body.status !== "DELETED_USER") {
      throw new ForbiddenException('el status no es ni professional ni eliminado');
    }
    const sendData: setStatusUserDto = { id, status: body.status };
    return this.client.send('auth-ms.set.status.user.admin', sendData).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @Patch('update-partner/:id')
  @UseGuards(AuthGuard)
  update_partner_status(@User() user: CurrentUser, @Param('id') id: string, @Body() body: { status: string }) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    if (body.status !== "USER_PARTNER" && body.status !== "DELETED_USER_PARTNER") {
      throw new ForbiddenException('el status no es ni partner ni eliminado');
    }
    const sendData: SetStatusPartnerDto = { id, status: body.status };
    return this.client.send('auth-ms.set.status.user.partner', sendData).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }
}
