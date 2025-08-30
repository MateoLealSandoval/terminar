import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
    console.log('🔌 AuthService connected');
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
          role: 'USER'
        }
      });

      const { password: _, ...rest } = newUser;
      
      return {
        user: rest,
        token: await this.singJwt(rest),
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
      console.log("🔍 LoginUser called");
      
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
          message: 'Credenciales inválidas'
        });
      }

      const { password: _, ...rest } = user;
      const token = await this.singJwt(rest);
      
      console.log("✅ Login successful");

      return {
        user: rest,
        token,
      };
    } catch (error) {
      console.error("❌ Login error:", error.message);
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
}
