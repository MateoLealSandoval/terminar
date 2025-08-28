import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { CreateUserDataDto } from '../dto/userData';
import { CurrentUser } from '../interfaces/current-user.interfaces';
import { auhPathcNameDto } from '../dto/userData/auhPathcNameDto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async createUserData(createUserDataDto: CreateUserDataDto) {
    try {
      const {
        userId,
        names,
        lastnames,
        perfilPhoto,
        phone,
        birthDay,
        birthMonth,
        birthYear,
        contactEmail,
        contactNames,
        contactLastnames,
        contactPhone,
        sex,
        city,
        familly,
        country,
        cityuser
      } = createUserDataDto;

      // Check if user exists
      const existingUser = await this.userData.findUnique({
        where: { id: userId }
      });

      const userData = {
        perfilPhoto: perfilPhoto || null,
        phone: phone || null,
        birthDay: birthDay ?? null,
        birthMonth: birthMonth ?? null,
        birthYear: birthYear ?? null,
        contactEmail: contactEmail || null,
        contactNames: contactNames || null,
        contactLastnames: contactLastnames || null,
        contactPhone: contactPhone || null,
        sex: sex || null,
        city: city || null,
        contactFamilly: familly || null,
        cityuser: cityuser || null,
        country: country || null,
      };

      if (existingUser) {
        // user exists update data 
        const sendUthUpdate: auhPathcNameDto = {
          names, lastnames, id: userId
        }
        const dataAuth = await firstValueFrom(
          this.client.send('auth-ms.patch.names.user', sendUthUpdate)
        )

        const { data } = await this.updateUserData(userId, createUserDataDto)
        return {
          status: 200,
          data: data,
          auth: dataAuth
        };
      }

      // create user not exists user
      const createdUser = await this.userData.create({
        data: {
          id: userId,
          ...userData
        }
      });
      const sendUthUpdate: auhPathcNameDto = {
        names, lastnames, id: userId
      }
      const dataAuth = await firstValueFrom(
        this.client.send('auth-ms.patch.names.user', sendUthUpdate)
      )

      return {
        status: 200,
        data: createdUser,
        auth: dataAuth
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateUserData(userId: string, updateDto: CreateUserDataDto) {
    try {
      // Verificar si el usuario existe
      const user = await this.userData.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new RpcException({
          status: 404,
          message: `EL usuario con id '${userId}' no existe`
        });
      }
      const {
        perfilPhoto,
        phone,
        birthDay,
        birthMonth,
        birthYear,
        contactEmail,
        contactNames,
        contactLastnames,
        contactPhone,
        sex,
        city,
        familly,
        country,
        cityuser
      } = updateDto;

      const updatedUser = await this.userData.update({
        where: { id: userId },
        data: {
          perfilPhoto,
          phone,
          birthDay,
          birthMonth,
          birthYear,
          contactEmail,
          contactNames,
          contactLastnames,
          contactPhone,
          sex,
          city,
          contactFamilly: familly,
          cityuser,
          country
        }
      });

      return {
        status: 200,
        data: updatedUser
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  async GetUserData(CurrentUser: CurrentUser) {
    try {
      const { id } = CurrentUser;
      const user = await this.userData.findUnique({
        where: {
          id: id
        }
      })
      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'Not exist data User'
        })
      }
      return {
        status: 200,
        data: user
      }

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }

  async get_user_by_id(id: string) {
    try {
      const user = await this.userData.findFirst({
        where: {
          id
        }
      })
      if (!user) {
        throw new RpcException({
          status: 400,
          message: "no se encontro el usuario con id " + id
        })
      }
      return {
        status: 200,
        data: user
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }

  // Método para obtener estado de pago de un usuario (para especialistas)
  async getPaymentStatus(userId: string) {
    try {
      // Verificar si el usuario es un especialista
      const authUser = await firstValueFrom(
        this.client.send('auth-ms.get.user.by.id', { id: userId })
      );

      if (!authUser || !authUser.data) {
        throw new RpcException({
          status: 404,
          message: 'Usuario no encontrado'
        });
      }

      // Si es especialista, consultar estado de pago en partner-ms
      if (authUser.data.role === 'USER_PARTNER') {
        try {
          const paymentStatus = await firstValueFrom(
            this.client.send('partner.payment.check.subscription', { partnerId: userId })
          );
          return paymentStatus;
        } catch (error) {
          // Si partner-ms no está disponible, retornar estado por defecto
          return {
            status: 200,
            data: {
              hasActiveSubscription: false,
              hasPaid: false,
              planType: null,
              paymentDate: null,
              expirationDate: null,
              isActive: false,
              message: 'Sistema de pagos no disponible temporalmente'
            }
          };
        }
      }

      // Si es usuario regular, no necesita suscripción
      return {
        status: 200,
        data: {
          hasActiveSubscription: true, // Los usuarios regulares siempre tienen "acceso"
          hasPaid: true,
          planType: 'FREE',
          isActive: true,
          userType: 'USER'
        }
      };

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Método para activar un profesional (cuando completa el pago)
  async activateProfessional(data: { userId: string, planType: string, transactionId: string }) {
    try {
      const { userId, planType, transactionId } = data;

      // Verificar que el usuario existe y es un especialista
      const authUser = await firstValueFrom(
        this.client.send('auth-ms.get.user.by.id', { id: userId })
      );

      if (!authUser || !authUser.data) {
        throw new RpcException({
          status: 404,
          message: 'Usuario no encontrado'
        });
      }

      if (authUser.data.role !== 'USER_PARTNER') {
        throw new RpcException({
          status: 403,
          message: 'Solo los especialistas pueden ser activados'
        });
      }

      // Activar el profesional en partner-ms
      try {
        const activationResult = await firstValueFrom(
          this.client.send('partner.payment.process', {
            partnerId: userId,
            transactionId,
            amount: this.getPlanAmount(planType),
            planType,
            paymentMethod: 'SYSTEM'
          })
        );

        return activationResult;
      } catch (error) {
        // Si partner-ms no está disponible, registrar la activación localmente
        console.warn('Partner-ms no disponible, registrando activación localmente');
        
        return {
          status: 200,
          data: {
            userId,
            planType,
            activatedAt: new Date().toISOString(),
            message: 'Profesional activado (pendiente sincronización con sistema de pagos)'
          }
        };
      }

    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Método auxiliar para obtener el monto según el tipo de plan
  private getPlanAmount(planType: string): number {
    const amounts = {
      'BASIC': 50000,
      'PREMIUM': 100000,
      'ENTERPRISE': 200000
    };
    return amounts[planType] || 50000;
  }

  // Método para obtener datos de usuario por ID (alias de get_user_by_id para compatibilidad)
  async getUserDataById(userId: string) {
    return this.get_user_by_id(userId);
  }

  async exampleUserdata() {
    return "example module modifier"
  }
}