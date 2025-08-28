import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDataDto } from '../dto/userData';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CurrentUser } from '../interfaces/current-user.interfaces';
import { auhPathcNameDto } from '../dto/auth-ms/authPathNames.dto';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Module userdata')

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super()
  }
  onModuleInit() {
    this.$connect();

  }
  async getUserData() {

  }

  async createUserData(createUserDataDto: CreateUserDataDto) {
    try {
      const {
        names,
        lastnames,
        userId,
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
        cityuser,
        country
      } = createUserDataDto;

      // search user
      const existingUser = await this.userData.findUnique({
        where: { id: userId }
      });

      const userData = {
        perfilPhoto: perfilPhoto || null,
        phone: phone || null,
        birthDay: birthDay || null,
        birthMonth: birthMonth || null,
        birthYear: birthYear || null,
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
        },

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


  async exampleUserdata() {
    return "example module modifier"
  }
}
