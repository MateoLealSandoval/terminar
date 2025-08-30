import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NATS_SERVICE } from 'src/config';

interface JwtPayload {
  id: string;
  email: string;
  names: string;
  lastnames: string;
  role: string;
}

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super();
  }

  onModuleInit() {
    this.$connect();
  }

  async singJwt(payload: JwtPayload) {
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
          role: 'USER'
        }
      });

      const { password: _, ...rest } = newUser;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role || 'USER'
      };

      return {
        user: rest,
        token: await this.singJwt(userForToken),
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
      const { email, names, password, lastnames, document, phone, title } = registerPartnerDto;
      const user = await this.user.findUnique({
        where: { email }
      });

      if (user) {
        throw new RpcException({
          statusCode: 400,
          message: 'El usuario ya existe'
        });
      }

      const Newuser = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          names,
          lastnames,
          role: 'USER_PARTNER'
        }
      });

      const { password: _, ...rest } = Newuser;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role || 'USER_PARTNER'
      };

      return {
        user: rest,
        token: await this.singJwt(userForToken)
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
      const user = await this.user.findUnique({
        where: { email }
      });

      const userAdmin = await this.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
      });

      if (userAdmin) {
        throw new RpcException({
          statusCode: 400,
          message: 'Solo puede existir un super admin'
        });
      }

      if (user) {
        throw new RpcException({
          statusCode: 400,
          message: 'El usuario ya existe'
        });
      }

      const Newuser = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          names,
          lastnames,
          role: 'SUPER_ADMIN'
        }
      });

      const { password: _, ...rest } = Newuser;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role || 'SUPER_ADMIN'
      };

      return {
        user: rest,
        token: await this.singJwt(userForToken)
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
          message: 'Usuario o contraseña no válida'
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 400,
          message: 'Correo o contraseña inválidos'
        });
      }

      const { password: _, ...rest } = user;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role || 'USER'
      };

      return {
        user: rest,
        token: await this.singJwt(userForToken)
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
      const decoded = this.jwtservice.verify(token, {
        secret: process.env.JWT_SECRET || 'EstoEsUnStringSeguroParaJWT2024'
      });
      return {
        user: decoded,
        token: await this.singJwt(decoded),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid token'
      });
    }
  }

  async verifyUserEmail(email: string) {
    try {
      const user = await this.user.findUnique({
        where: { email },
        select: { id: true, email: true, names: true, lastnames: true }
      });
      return {
        status: 200,
        data: !!user
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Error interno al obtener el usuario'
      });
    }
  }

  async get_data_basic_user(id: string) {
    try {
      const user = await this.user.findFirst({
        where: { id },
        select: { names: true, lastnames: true, email: true }
      });
      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'No existe el usuario'
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
}

  async getInformationUsersAdmin(id: string) {
    try {
      const user = await this.user.findFirst({
        where: { id },
        select: { names: true, lastnames: true, email: true, role: true, id: true }
      });
      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'No existe el usuario'
        });
      }
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        throw new RpcException({
          statusCode: 401,
          message: 'Sin permisos de administrador'
        });
      }
      const totalUsers = await this.user.count({
        where: { role: 'USER' }
      });
      const totalPartner = await this.user.count({
        where: { role: 'USER_PARTNER' }
      });
      return {
        status: 200,
        data: {
          user: user,
          totalUsers: totalUsers,
          totalPartner: totalPartner
        }
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  async getAllUsersPartners(PaginationDto: any) {
    try {
      const { limit, page } = PaginationDto;
      const currentPage = page ?? 1;
      const perPage = limit ?? 10;
      const offset = (currentPage - 1) * perPage;

      const users = await this.user.findMany({
        where: { role: 'USER_PARTNER' },
        select: { names: true, lastnames: true, email: true, role: true, id: true },
        skip: offset,
        take: perPage,
        orderBy: { email: 'asc' }
      });

      const total = await this.user.count({
        where: { role: 'USER_PARTNER' }
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
        message: error.message,
      });
    }
  }

  async getAllUsers(PaginationDto: any) {
    try {
      const { limit, page } = PaginationDto;
      const currentPage = page ?? 1;
      const perPage = limit ?? 10;
      const offset = (currentPage - 1) * perPage;

      const users = await this.user.findMany({
        where: { role: 'USER' },
        select: { names: true, lastnames: true, email: true, role: true, id: true },
        skip: offset,
        take: perPage,
        orderBy: { email: 'asc' }
      });

      const total = await this.user.count({
        where: { role: 'USER' }
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
        message: error.message,
      });
    }
  }
}
