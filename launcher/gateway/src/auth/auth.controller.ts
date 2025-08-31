import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Inject, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterPartnerDto, RegisterUserDto, SetStatusPartnerDto, setStatusUserDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthGuard } from 'src/guards/authGuards';
import { Token, User } from './decorator';
import { CurrentUser } from './interfaces/current-user.interfaces';
import { PaginationDto } from 'src/commont/pagination.dto';


@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('register')
  registerUser(@Body() RegisterUserDto: RegisterUserDto) {
    return this.client.send('create.user.token.email', RegisterUserDto).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error en el registro',
          statusCode
        );
      })
    );
  }

  @Post('register-super-admin')
  registerSuperAdmin(@Body() RegisterUserDto: RegisterUserDto) {
    return this.client.send('auth-ms.create.user.superadmin', RegisterUserDto).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error en el registro de super admin',
          statusCode
        );
      })
    );
  }

  @Get('register/usertoken/:token')
  registerUserToken(@Param('token') token: string) {
    return this.client.send('confirm.register.user.token.email', { token }).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error en la confirmación',
          statusCode
        );
      })
    )
  }

  @Post('registerpartner')
  registerPartner(@Body() RegisterPartnerDto: RegisterPartnerDto) {
    return this.client.send('auth.register.partner', RegisterPartnerDto).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error en el registro de partner',
          statusCode
        );
      })
    );
  }

  @Post('login')
  async loginUser(@Body() LoginUserDto: LoginUserDto) {
    try {
      const result = await firstValueFrom(
        this.client.send('auth.login.user', LoginUserDto)
      );
      return result;
    } catch (error) {
      console.error('Gateway login error:', error);
      
      // Convertir status string a número si es necesario
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      
      if (typeof error?.status === 'number') {
        statusCode = error.status;
      } else if (error?.status === 'error') {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      
      // Si el error viene anidado
      if (error?.error?.status && typeof error.error.status === 'number') {
        statusCode = error.error.status;
      }
      
      const message = error?.message || error?.error?.message || 'Error interno del servidor';
      
      throw new HttpException(message, statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return this.client.send('auth.verify.user.data.token', token)
  }

  @Get('get-all-partner')
  @UseGuards(AuthGuard)
  get_all_partner(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.get.all.partner.pagination.admin', pagination).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error obteniendo partners',
          statusCode
        );
      })
    );
  }

  @Get('panel-data-users')
  @UseGuards(AuthGuard)
  get_users_data(@User() user: CurrentUser) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.information.users.admin', { id: user.id }).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error obteniendo datos del panel',
          statusCode
        );
      })
    );
  }

  @Get('get-all-users')
  @UseGuards(AuthGuard)
  get_all_users(@User() user: CurrentUser, @Query() pagination: PaginationDto) {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.client.send('auth-ms.get.all.user.pagination.admin', pagination).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error obteniendo usuarios',
          statusCode
        );
      })
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
    const sendData: setStatusUserDto = {
      id,
      status: body.status,
    }
    return this.client.send('auth-ms.set.status.user.admin', sendData).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error actualizando usuario',
          statusCode
        );
      })
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
    const sendData: SetStatusPartnerDto = {
      id,
      status: body.status,
    }
    return this.client.send('auth-ms.set.status.user.partner', sendData).pipe(
      catchError(error => {
        const statusCode = typeof error?.status === 'number' ? error.status : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          error?.message || 'Error actualizando partner',
          statusCode
        );
      })
    );
  }
}