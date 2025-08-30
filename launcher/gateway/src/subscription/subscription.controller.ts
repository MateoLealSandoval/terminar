import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy, Inject } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { CurrentUser } from '../auth/interfaces/current-user.interface';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  getUserSubscription(@User() user: CurrentUser) {
    return this.client.send('auth.subscription.get', { userId: user.id }).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createSubscription(@User() user: CurrentUser, @Body() body: any) {
    const data = {
      userId: user.id,
      ...body
    };
    return this.client.send('auth.subscription.create', data).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }

  @UseGuards(AuthGuard)
  @Post('renew')
  renewSubscription(@User() user: CurrentUser, @Body() body: any) {
    const data = {
      userId: user.id,
      ...body
    };
    return this.client.send('auth.subscription.renew', data).pipe(
      catchError(error => throwError(() => new RpcException(error)))
    );
  }
}