#!/bin/bash

echo "🔧 Corrección TOTAL de Auth-MS"
echo "============================="

# Primero, asegurar que el schema.prisma sea correcto
docker compose exec -T auth-ms sh << 'SCHEMA_EOF'
cat > prisma/schema.prisma << 'PRISMA_SCHEMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  USER_PARTNER
  ADMIN
  SUPER_ADMIN
  DELETED_USER
  DELETED_USER_PARTNER
  PENDING_DELETE
  PENDING_PARTNER
}

model User {
  id        String @id @default(uuid())
  email     String @unique
  names     String
  lastnames String
  password  String
  role      Role?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
PRISMA_SCHEMA

echo "✅ Schema.prisma actualizado"
SCHEMA_EOF

# Regenerar cliente Prisma
echo -e "\n🔄 Regenerando cliente Prisma..."
docker compose exec auth-ms npx prisma generate

# Crear service SIN errores TypeScript
docker compose exec -T auth-ms sh << 'SERVICE_EOF'
cat > src/auth/auth.service.ts << 'CLEAN_SERVICE'
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
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

  async onModuleInit() {
    await this.$connect();
    console.log('🔌 AuthService connected to database');
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
          role: Role.USER
        }
      });

      const { password: _, ...rest } = newUser;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role
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
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role
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

  async CreateSuperAdmin(registerUserDto: any) {
    try {
      const { email, names, password, lastnames } = registerUserDto;
      const userAdmin = await this.user.findFirst({
        where: { role: Role.SUPER_ADMIN }
      });

      if (userAdmin) {
        throw new RpcException({
          statusCode: 400,
          message: 'Solo puede existir un super admin'
        });
      }

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
          role: Role.SUPER_ADMIN
        }
      });

      const { password: _, ...rest } = newUser;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role
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

  // *** MÉTODO LOGIN CON VALIDACIÓN REAL DE CONTRASEÑAS ***
  async LoginUser(loginUserDto: any) {
    try {
      console.log("🔍 LoginUser called with:", loginUserDto);
      
      const { email, password } = loginUserDto;
      
      // Buscar usuario en la base de datos
      const user = await this.user.findUnique({
        where: { email }
      });

      console.log("👤 User found:", user ? `${user.names} (${user.email})` : 'No user found');

      if (!user) {
        throw new RpcException({
          statusCode: 400,
          message: 'Usuario o contraseña no válida'
        });
      }

      // VALIDACIÓN REAL DE CONTRASEÑA
      console.log("🔐 Verificando contraseña contra base de datos...");
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log("🔐 Password válida:", isPasswordValid);

      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 400,
          message: 'Correo o contraseña inválidos'
        });
      }

      // Preparar datos para el token
      const { password: _, ...rest } = user;
      const userForToken: JwtPayload = {
        id: rest.id,
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        role: rest.role
      };

      console.log("✅ Credenciales válidas, generando token JWT...");
      const token = await this.singJwt(userForToken);

      return {
        user: rest,
        token
      };
    } catch (error) {
      console.error("❌ Error en LoginUser:", error.message);
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtservice.verify(token);
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
      return {
        status: 500,
        data: false
      };
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
        statusCode: 500,
        message: error.message
      });
    }
  }
}
CLEAN_SERVICE

echo "✅ AuthService restaurado completamente"
SERVICE_EOF

# Reiniciar servicios
echo -e "\n🔄 Reiniciando todos los servicios..."
docker compose restart auth-ms gateway

# Esperar estabilización
echo "⏳ Esperando estabilización (20 segundos)..."
sleep 20

# Verificar estado final
echo -e "\n📊 Estado final:"
docker compose logs auth-ms --tail=5

echo -e "\n🎯 RESUMEN:"
echo "✅ AuthService restaurado con VALIDACIÓN REAL"
echo "✅ Login verifica contraseñas contra base de datos"
echo "✅ Ya NO acepta cualquier contraseña"
echo "✅ Genera tokens JWT correctos"
echo ""
echo "🧪 Prueba ahora el login con credenciales reales"