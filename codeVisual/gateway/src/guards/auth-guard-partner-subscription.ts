import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuardPartnerSubscription implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verificar si el usuario es un especialista/partner
    if (user.role !== 'USER_PARTNER') {
      throw new UnauthorizedException('Acceso restringido a especialistas');
    }

    try {
      // Verificar suscripción activa usando el servicio correcto de partner
      const subscriptionCheck = await firstValueFrom(
        this.client.send('partner.payment.check.subscription', { partnerId: user.id })
      );

      if (!subscriptionCheck.data.hasActiveSubscription) {
        throw new UnauthorizedException(
          'Tu suscripción ha expirado o no tienes un plan activo. Por favor, renueva tu suscripción para continuar.'
        );
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException(
        'Error al verificar la suscripción. Por favor, contacta soporte.'
      );
    }
  }
}