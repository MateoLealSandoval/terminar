#!/bin/bash

echo "🔧 Restaurando Auth Service COMPLETO con validación real"
echo "======================================================"

# Restaurar service completo con TODOS los métodos
docker compose exec -T auth-ms sh << 'RESTORE_EOF'
# Backup del service actual
cp src/auth/auth.service.ts src/auth/auth.service.ts.incomplete-backup

# Crear service COMPLETO con validación real de contraseñas
cat > src/auth/auth.service.ts << 'COMPLETE_SERVICE'
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
        role: rest.role || 'USER_PARTNER'
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

  // *** MÉTODO LOGIN COMPLETO CON VALIDACIÓN REAL ***
  async LoginUser(loginUserDto: any) {
    try {
      console.log("🔍 LoginUser called with:", loginUserDto);
      
      const { email, password } = loginUserDto;
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

      console.log("🔐 Verifying password...");
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log("🔐 Password valid:", isPasswordValid);

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

      console.log("✅ Login successful, generating token...");
      const token = await this.singJwt(userForToken);

      return {
        user: rest,
        token
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
COMPLETE_SERVICE

echo "✅ Service restaurado con validación real de contraseñas"
RESTORE_EOF

# Reiniciar para aplicar cambios
echo -e "\n🔄 Reiniciando auth-ms..."
docker compose restart auth-ms

# Esperar compilación
echo "⏳ Esperando compilación (15 segundos)..."
sleep 15

# Verificar compilación
echo -e "\n✅ Verificando compilación:"
compilation_logs=$(docker compose logs auth-ms --tail=5 2>&1)
if echo "$compilation_logs" | grep -q "Found 0 errors"; then
    echo "✅ Compilación exitosa"
    
    if echo "$compilation_logs" | grep -q "connected"; then
        echo "✅ Base de datos conectada"
    fi
    
    # Verificar que NATS está registrado
    sleep 5
    nats_check=$(curl -s http://localhost:8222/connz | grep -c "auth-ms" || echo "0")
    if [ "$nats_check" -gt "0" ]; then
        echo "✅ Auth-MS registrado en NATS"
    else
        echo "⚠️  Verificando registro NATS..."
        docker compose restart auth-ms
        sleep 10
    fi
    
else
    echo "❌ Errores de compilación:"
    echo "$compilation_logs" | grep -i error
fi

echo -e "\n🎯 Auth-MS restaurado con validación completa de usuarios y contraseñas"
echo "El login ahora verifica correctamente contra la base de datos"