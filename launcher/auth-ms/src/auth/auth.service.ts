import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('AuthService connected');
  }

  async singJwt(payload: any) {
    return this.jwtservice.sign(payload);
  }

  async registerUser(registerUserDto: any) {
    try {
      const { email, names, password, lastnames } = registerUserDto;
      const existingUser = await this.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        throw new RpcException({
          statusCode: 400,
          message: 'El usuario ya existe'
        });
      }
      const newUser = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          names,
          lastnames,
          role: Role.USER
        }
      });
      const { password: _, ...rest } = newUser;
      return {
        user: rest,
        token: await this.singJwt(rest)
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async registerPartner(registerPartnerDto: any) {
    try {
      const { email, names, password, lastnames } = registerPartnerDto;
      const existingUser = await this.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        throw new RpcException({
          statusCode: 400,
          message: 'El partner ya existe'
        });
      }
      const newPartner = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          names,
          lastnames,
          role: Role.USER_PARTNER
        }
      });
      const { password: _, ...rest } = newPartner;
      return {
        user: rest,
        token: await this.singJwt(rest)
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async CreateSuperAdmin(registerUserDto: any) {
    try {
      const { email, names, password, lastnames } = registerUserDto;
      const existingUser = await this.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        throw new RpcException({
          statusCode: 400,
          message: 'El super admin ya existe'
        });
      }
      const newSuperAdmin = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          names,
          lastnames,
          role: Role.SUPER_ADMIN
        }
      });
      const { password: _, ...rest } = newSuperAdmin;
      return {
        user: rest,
        token: await this.singJwt(rest)
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async LoginUser(loginUserDto: any) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.user.findUnique({
        where: { email }
      });
      if (!user) {
        throw new RpcException({
          statusCode: 400,
          message: 'Usuario no encontrado'
        });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 400,
          message: 'Credenciales invalidas'
        });
      }
      const { password: _, ...rest } = user;
      return {
        user: rest,
        token: await this.singJwt(rest)
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtservice.verify(token);
      return { valid: true, user: payload };
    } catch (error) {
      return { valid: false, user: null };
    }
  }

  async get_data_basic_user(id: string) {
    try {
      const user = await this.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true
        }
      });
      if (!user) {
        throw new RpcException({
          statusCode: 404,
          message: "Usuario no encontrado"
        });
      }
      return {
        status: 200,
        data: user
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async getInformationUsersAdmin(id: string) {
    try {
      const user = await this.user.findUnique({
        where: { id }
      });
      if (!user) {
        throw new RpcException({
          statusCode: 404,
          message: "Usuario no encontrado"
        });
      }
      const { password: _, ...userData } = user;
      return {
        status: 200,
        data: userData
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async getAllUsersPartners(PaginationDto: any) {
    try {
      const { page = 1, limit = 10 } = PaginationDto;
      const currentPage = Math.max(1, Number(page));
      const perPage = Math.max(1, Math.min(100, Number(limit)));
      const offset = (currentPage - 1) * perPage;
      
      const users = await this.user.findMany({
        where: { role: Role.USER_PARTNER },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true
        },
        skip: offset,
        take: perPage
      });
      
      const total = await this.user.count({
        where: { role: Role.USER_PARTNER }
      });
      
      const totalPages = Math.ceil(total / perPage);
      
      return {
        status: 200,
        data: users,
        meta: { total, page: currentPage, limit: perPage, totalPages }
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async getAllUsers(PaginationDto: any) {
    try {
      const { page = 1, limit = 10 } = PaginationDto;
      const currentPage = Math.max(1, Number(page));
      const perPage = Math.max(1, Math.min(100, Number(limit)));
      const offset = (currentPage - 1) * perPage;
      
      const users = await this.user.findMany({
        where: { role: Role.USER },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true
        },
        skip: offset,
        take: perPage
      });
      
      const total = await this.user.count({
        where: { role: Role.USER }
      });
      
      const totalPages = Math.ceil(total / perPage);
      
      return {
        status: 200,
        data: users,
        meta: { total, page: currentPage, limit: perPage, totalPages }
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async verifyUserEmail(email: string) {
    try {
      const user = await this.user.findUnique({
        where: { email }
      });
      return { data: !!user };
    } catch (error) {
      return { data: false };
    }
  }
}
