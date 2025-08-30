#!/bin/bash

echo "🔧 Restaurando Auth Service COMPLETO"
echo "===================================="

# Crear el service completo con TODOS los métodos que necesita el controller
docker compose exec -T auth-ms sh << 'EOF'
# Backup del service actual
cp src/auth/auth.service.ts src/auth/auth.service.ts.incomplete-backup

# Crear service COMPLETO con todos los métodos
cat > src/auth/auth.service.ts << 'COMPLETE_SERVICE'
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
    console.log('🔌 AuthService connected to database');
  }

  async singJwt(payload: any) {
    return this.jwtservice.sign(payload);
  }

  // 1. MÉTODO EXISTENTE - registerUser
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

  // 2. MÉTODO FALTANTE - registerPartner
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
          role: 'PARTNER'
        }
      });

      const { password: _, ...rest } = newPartner;
      
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

  // 3. MÉTODO FALTANTE - CreateSuperAdmin
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
          role: 'SUPER_ADMIN'
        }
      });

      const { password: _, ...rest } = newSuperAdmin;
      
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

  // 4. MÉTODO EXISTENTE - LoginUser
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

      return {
        user: rest,
        token,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message
      });
    }
  }

  // 5. MÉTODO EXISTENTE - verifyToken
  async verifyToken(token: string) {
    try {
      const payload = this.jwtservice.verify(token);
      return { valid: true, user: payload };
    } catch (error) {
      return { valid: false, user: null };
    }
  }

  // 6. MÉTODO FALTANTE - get_data_basic_user
  async get_data_basic_user(id: string) {
    try {
      const user = await this.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true,
          emailVerified: true
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

  // 7. MÉTODO FALTANTE - getInformationUsersAdmin
  async getInformationUsersAdmin(id: string) {
    try {
      const user = await this.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
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

  // 8. MÉTODO FALTANTE - getAllUsersPartners
  async getAllUsersPartners(PaginationDto: any) {
    try {
      const { page = 1, limit = 10 } = PaginationDto;
      const currentPage = Math.max(1, Number(page));
      const perPage = Math.max(1, Math.min(100, Number(limit)));
      const offset = (currentPage - 1) * perPage;
      
      const users = await this.user.findMany({
        where: { role: "PARTNER" },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        },
        skip: offset,
        take: perPage,
        orderBy: { createdAt: "desc" }
      });
      
      const total = await this.user.count({
        where: { role: "PARTNER" }
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

  // 9. MÉTODO FALTANTE - getAllUsers
  async getAllUsers(PaginationDto: any) {
    try {
      const { page = 1, limit = 10 } = PaginationDto;
      const currentPage = Math.max(1, Number(page));
      const perPage = Math.max(1, Math.min(100, Number(limit)));
      const offset = (currentPage - 1) * perPage;
      
      const users = await this.user.findMany({
        where: { role: "USER" },
        select: {
          id: true,
          email: true,
          names: true,
          lastnames: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        },
        skip: offset,
        take: perPage,
        orderBy: { createdAt: "desc" }
      });
      
      const total = await this.user.count({
        where: { role: "USER" }
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

  // 10. MÉTODO EXISTENTE - verifyUserEmail
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
COMPLETE_SERVICE

echo "✅ Auth Service COMPLETO creado con TODOS los métodos"
EOF

echo -e "\n🔄 Reiniciando auth-ms..."
docker compose restart auth-ms

echo -e "\n⏳ Esperando compilación completa (25 segundos)..."
sleep 25

echo -e "\n📊 Verificando compilación..."
compile_result=$(docker compose logs auth-ms --tail=10)

if echo "$compile_result" | grep -q "Found 0 errors"; then
    echo "✅ ¡COMPILACIÓN EXITOSA! - 0 errores"
    
    if echo "$compile_result" | grep -q "successfully started"; then
        echo "✅ ¡MICROSERVICIO ACTIVO!"
        
        echo -e "\n🧪 Probando funcionalidad..."
        
        # Crear usuario de prueba
        timestamp=$(date +%s)
        test_email="restored${timestamp}@test.com"
        test_password="Test1234"
        
        echo "Registrando usuario: $test_email"
        register_response=$(curl -s -X POST http://localhost:3000/auth/register \
          -H "Content-Type: application/json" \
          -d "{
            \"email\": \"$test_email\",
            \"password\": \"$test_password\",
            \"names\": \"Restored\",
            \"lastnames\": \"User\"
          }" \
          -w "\nHTTP:%{http_code}")
        
        reg_code=$(echo "$register_response" | grep "HTTP:" | cut -d: -f2)
        
        if [ "$reg_code" = "201" ] || [ "$reg_code" = "200" ]; then
            echo "✅ Registro exitoso"
            
            sleep 3
            echo "Probando login..."
            
            login_response=$(curl -s -X POST http://localhost:3000/auth/login \
              -H "Content-Type: application/json" \
              -d "{
                \"email\": \"$test_email\",
                \"password\": \"$test_password\"
              }" \
              -w "\nHTTP:%{http_code}")
            
            login_code=$(echo "$login_response" | grep "HTTP:" | cut -d: -f2)
            
            if [ "$login_code" = "201" ] || [ "$login_code" = "200" ]; then
                echo "🎉 ¡¡¡LOGIN FUNCIONA PERFECTAMENTE!!!"
                echo "=================================="
                echo "✅ AUTH SERVICE COMPLETAMENTE RESTAURADO"
                echo "✅ Todos los métodos implementados"
                echo "✅ Login funcionando"
                echo "✅ Registro funcionando"
                echo "✅ Sistema listo para usar"
                echo "=================================="
                echo "📧 Email prueba: $test_email"
                echo "🔑 Password: $test_password"
                echo "🌐 Frontend: http://localhost:8080"
            else
                echo "❌ Login falló (HTTP: $login_code)"
            fi
        else
            echo "❌ Registro falló (HTTP: $reg_code)"
        fi
    else
        echo "⚠️ Microservicio compiló pero no está activo"
        docker compose logs auth-ms --tail=3
    fi
else
    echo "❌ Aún hay errores de compilación:"
    echo "$compile_result" | grep -i "Found.*errors"
    echo "$compile_result" | grep -i "error TS" | head -3
fi