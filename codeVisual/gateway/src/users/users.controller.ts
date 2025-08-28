import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs/internal/operators/catchError';
import { NATS_SERVICE } from 'src/config';
import { throwError } from 'rxjs';
import { AuthGuard } from 'src/guards/authGuards';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';
import { CreateUserDataBodyDto } from './dto/CreateUserDataBody.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Get('example')
  example() {
    return this.client.send('user.example.user', {}).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createUserData(@User() user: CurrentUser, @Body() dataUserBody:  CreateUserDataBodyDto) {
    return this.client.send('User.CreateUserData.User', {
      ...dataUserBody,
      userId: user.id
    }).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }



  @UseGuards(AuthGuard)
  @Get('get-data')
  GetUserData(@User() user: CurrentUser) {
    return this.client.send('User.GetDataUser.User', user).pipe(
      catchError(error => {
        return throwError(() => new RpcException(error));
      })
    );
  }

  // Verificar estado de pago
  @Get('payment-status/:userId')
  async getPaymentStatus(@Param('userId') userId: string) {
    return this.client.send('get.payment.status', userId);
  }

  // Verificar pago con Epayco
  @Post('verify-payment')
  async verifyPayment(@Body() data: any) {
    // Por ahora simulamos verificación exitosa
    // En producción, aquí deberías verificar con la API de Epayco
    return { 
      success: true, 
      userName: 'Usuario',
      message: 'Pago verificado correctamente'
    };
  }

  // Activar profesional después del pago
  @Post('activate-professional')
  async activateProfessional(@Body() data: any) {
    return this.client.send('activate.professional', data);
  }

}

