import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
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


}

