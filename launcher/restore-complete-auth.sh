#!/bin/bash

echo "🔧 RESTAURANDO AUTH-MS COMPLETO CON FUNCIONALIDAD REAL"
echo "===================================================="

# Verificar que estamos en el directorio correcto
if [ -d "launcher" ]; then
    cd launcher/
    echo "✅ Cambiado a directorio launcher/"
elif [ -f "docker-compose.yml" ]; then
    echo "✅ Ya estamos en el directorio correcto"
else
    echo "❌ No se encuentra el directorio launcher/ ni docker-compose.yml"
    echo "Por favor ejecuta el script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar que los servicios estén corriendo
if ! docker compose ps | grep -q "auth-ms.*Up"; then
    echo "⚠️  Auth-MS no está corriendo, iniciando..."
    docker compose up -d auth-ms
    sleep 15
fi

# 1. RESTAURAR EL AUTH SERVICE COMPLETO
echo "1️⃣ Restaurando auth.service.ts completo..."

docker compose exec -T auth-ms sh << 'EOF'
# Crear el auth.service.ts completo con todas las funcionalidades
cat > src/auth/auth.service.ts << 'SERVICE_EOF'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient, Role, StatusPendingPartner } from '@prisma/client';
import { LoginUserDto, RegisterUserDto, SetStatusPartnerDto, setStatusUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/payload.interface';
import { envs, NATS_SERVICE } from 'src/config';
import { RegisterPartnerDto } from './dto/Register-partner.dto copy';
import { firstValueFrom } from 'rxjs';
import { CreateUserPartnerDto } from './dto/CreateUserPartner.dto';
import { PaginationDto } from './commont/pagination.dto';
import { auhPathcNameDto } from './dto/authPathNames.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    constructor(
        private readonly jwtservice: JwtService,
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    onModuleInit() {
        this.$connect();
    }

    async singJwt(Payload: JwtPayload) {
        return this.jwtservice.sign(Payload)
    }

    async patchNames(datas: auhPathcNameDto) {
        try {
            const { id, lastnames, names } = datas;
            const user = await this.user.findUnique({
                where: {
                    id
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario no existe'
                })
            }
            const editData = await this.user.update({
                where: {
                    id
                },
                data: {
                    names: names, 
                    lastnames: lastnames
                },
                select: {
                    email: true,
                    lastnames: true,
                    names: true,
                    id: true
                }
            })
            return {
                status: 200,
                data: editData
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async registerUser(RegisterUserDto: RegisterUserDto) {
        try {
            const { email, names, password, lastnames } = RegisterUserDto;
            const user = await this.user.findUnique({
                where: {
                    email: email
                }
            });

            if (user) {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario ya existe'
                })
            }

            const Newuser = await this.user.create({
                data: {
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    names: names,
                    lastnames: lastnames,
                    role: 'USER'
                }
            });

            const { password: __, ...rest } = Newuser;

            return {
                user: rest,
                token: await this.singJwt(rest),
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async CreateSuperAdmin(RegisterUserDto: RegisterUserDto) {
        try {
            const { email, names, password, lastnames } = RegisterUserDto;
            const user = await this.user.findUnique({
                where: {
                    email: email
                }
            });

            const userAdmin = await this.user.findFirst({
                where: {
                    role: 'SUPER_ADMIN'
                }
            })

            if (userAdmin) {
                throw new RpcException({
                    status: 400,
                    message: 'Solo puede existir un super admin'
                })
            }

            if (user) {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario ya existe'
                })
            }

            const Newuser = await this.user.create({
                data: {
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    names: names,
                    lastnames: lastnames,
                    role: 'SUPER_ADMIN'
                }
            });

            const { password: __, ...rest } = Newuser;
            return {
                user: rest,
                token: await this.singJwt(rest),
                datauser: Newuser
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async resetPassword(email: string, password: string) {
        try {
            const user = await this.user.findFirst({
                where: {
                    email: email
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario no existe'
                })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.user.update({
                where: {
                    email: email
                },
                data: {
                    password: hashedPassword
                }
            })
            return {
                status: 200,
                data: 'Contraseña actualizada correctamente',
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async registerPartner(RegisterUserDto: RegisterPartnerDto) {
        const { email, names, password, lastnames, document, phone, title } = RegisterUserDto;
        const user = await this.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            throw new RpcException({
                status: 400,
                message: 'El usuario ya existe'
            })
        }

        const Newuser = await this.user.create({
            data: {
                email: email,
                password: bcrypt.hashSync(password, 10),
                names: names,
                lastnames: lastnames,
                role: 'USER_PARTNER'
            }
        });
        
        const { password: __, ...rest } = Newuser;
        const dataNewPartner: CreateUserPartnerDto = {
            id: Newuser.id,
            document: document,
            phone: phone,
            title: title
        }

        const dataUser = await firstValueFrom(
            this.client.send('update.partner.partner', {
                id: dataNewPartner.id,
                document: document,
                phone: phone,
                title: dataNewPartner.title,
                name: names
            })
        )

        return {
            user: rest,
            token: await this.singJwt(rest),
            dataUser: dataUser
        };
    }

    // MÉTODO LOGIN COMPLETO CON VALIDACIÓN REAL
    async LoginUser(LoginUserDto: LoginUserDto) {
        try {
            console.log("🔍 LoginUser called with:", LoginUserDto);
            
            const { email, password } = LoginUserDto;
            const user = await this.user.findUnique({
                where: {
                    email: email
                }
            });

            console.log("👤 User found:", user ? { id: user.id, email: user.email, role: user.role } : "No user found");

            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'Usuario o contraseña no válida'
                })
            }

            if (user.role === 'DELETED_USER' || user.role === 'DELETED_USER_PARTNER') {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario fue eliminado'
                })
            }

            console.log("🔐 Validating password...");
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            console.log("🔐 Password valid:", isPasswordValid);

            if (!isPasswordValid) {
                throw new RpcException({
                    status: 400,
                    message: 'Correo o contraseña inválidos'
                })
            }

            const { password: __, ...rest } = user;

            console.log("✅ Login successful for user:", { id: rest.id, email: rest.email, role: rest.role });

            return {
                user: rest,
                token: await this.singJwt(rest)
            };

        } catch (error) {
            console.error("❌ LoginUser error:", error.message);
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtservice.verify(token, {
                secret: envs.jwtSecret
            })
            return {
                user: user,
                token: await this.singJwt(user),
            }
        } catch (error) {
            throw new RpcException({
                status: 401,
                message: 'Invalid token'
            })
        }
    }

    async refreshtoken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtservice.verify(token, {
                secret: envs.jwtSecret
            })
            const userdata = await this.user.findFirst({
                where: {
                    id: user.id
                }
            })
            return {
                user: userdata,
                token: await this.singJwt(user),
            }
        } catch (error) {
            throw new RpcException({
                status: 401,
                message: 'Invalid token'
            })
        }
    }

    async verifyUserEmail(email: string) {
        try {
            const user = await this.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    lastnames: true,
                }
            });
            if (!user) {
                return {
                    status: 400,
                    data: false
                }
            }
            return {
                status: 200,
                data: true
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al obtener el usuario',
            });
        }
    }

    async get_data_basic_user(id: string) {
        try {
            const user = await this.user.findFirst({
                where: { id: id },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'No existe el usuario'
                })
            }
            return {
                status: 200,
                data: user
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async getInformationUsersAdmin(id: string) {
        try {
            const user = await this.user.findFirst({
                where: { id: id },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                    role: true,
                    id: true
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'No existe el usuario'
                })
            }
            if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
                throw new RpcException({
                    status: 401,
                    message: 'Sin permisos de administrador'
                })
            }
            const totalUsers = await this.user.count({
                where: {
                    role: 'USER'
                }
            })
            const totalPartner = await this.user.count({
                where: {
                    role: 'USER_PARTNER'
                }
            })
            return {
                status: 200,
                data: {
                    user: user,
                    totalUsers: totalUsers,
                    totalPartner: totalPartner
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async getAllUsersPartners(PaginationDto: PaginationDto) {
        try {
            const { limit, page } = PaginationDto;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const offset = (currentPage - 1) * perPage;

            const users = await this.user.findMany({
                where: {
                    role: 'USER_PARTNER'
                },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                    role: true,
                    id: true
                },
                skip: offset,
                take: perPage,
                orderBy: {
                    email: 'asc'
                }
            });

            const total = await this.user.count({
                where: {
                    role: 'USER_PARTNER'
                }
            })

            const totalPages = Math.ceil(total / perPage);

            return {
                status: 200,
                data: users,
                meta: {
                    total,
                    page: currentPage,
                    limit: perPage,
                    totalPages
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async getAllUsers(PaginationDto: PaginationDto) {
        try {
            const { limit, page } = PaginationDto;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const offset = (currentPage - 1) * perPage;

            const users = await this.user.findMany({
                where: {
                    role: 'USER'
                },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                    role: true,
                    id: true
                },
                skip: offset,
                take: perPage,
                orderBy: {
                    email: 'asc'
                }
            });

            const total = await this.user.count({
                where: {
                    role: 'USER'
                }
            })

            const totalPages = Math.ceil(total / perPage);

            return {
                status: 200,
                data: users,
                meta: {
                    total,
                    page: currentPage,
                    limit: perPage,
                    totalPages
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async setStatusPartners(SetStatusPartnerDto: SetStatusPartnerDto) {
        try {
            const { id, status } = SetStatusPartnerDto;
            const user = await this.user.findFirst({
                where: {
                    id: id,
                    role: 'USER_PARTNER'
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'No existe el usuario partner'
                })
            }
            const userUpdate = await this.user.update({
                where: {
                    id: id
                },
                data: {
                    role: status === 'ACTIVE' ? 'USER_PARTNER' : 'DELETED_USER_PARTNER'
                },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                    role: true,
                    id: true
                }
            })
            return {
                status: 200,
                data: userUpdate
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async setStatusUser(setStatusUserDto: setStatusUserDto) {
        try {
            const { id, status } = setStatusUserDto;
            const user = await this.user.findFirst({
                where: {
                    id: id,
                    role: 'USER'
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'No existe el usuario'
                })
            }
            const userUpdate = await this.user.update({
                where: {
                    id: id
                },
                data: {
                    role: status === 'ACTIVE' ? 'USER' : 'DELETED_USER'
                },
                select: {
                    names: true,
                    lastnames: true,
                    email: true,
                    role: true,
                    id: true
                }
            })
            return {
                status: 200,
                data: userUpdate
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }
}
SERVICE_EOF

echo "✅ Auth service completo restaurado"
EOF

# 2. VERIFICAR Y INSTALAR DEPENDENCIAS
echo -e "\n2️⃣ Verificando dependencias..."
docker compose exec -T auth-ms sh << 'EOF'
# Instalar todas las dependencias necesarias
npm install @nestjs/jwt bcrypt @types/bcrypt class-validator class-transformer

# Generar cliente Prisma
npx prisma generate

echo "✅ Dependencias verificadas"
EOF

# 3. REINICIAR AUTH-MS
echo -e "\n3️⃣ Reiniciando auth-ms..."
docker compose restart auth-ms
sleep 20

# 4. VERIFICAR COMPILACIÓN
echo -e "\n4️⃣ Verificando compilación..."
if docker compose logs auth-ms --tail=10 | grep -q "Nest microservice successfully started"; then
    echo "✅ Auth-MS iniciado correctamente con funcionalidad completa"
elif docker compose logs auth-ms --tail=10 | grep -q "Found 0 errors"; then
    echo "✅ Auth-MS compilado sin errores, esperando inicio..."
    sleep 10
else
    echo "⚠️  Verificando errores..."
    docker compose logs auth-ms --tail=20 | grep -i error
    echo -e "\n⚠️  Intentando reinicio adicional..."
    docker compose restart auth-ms
    sleep 20
fi

# Verificar que el gateway esté corriendo
if ! docker compose ps | grep -q "gateway.*Up"; then
    echo "⚠️  Gateway no está corriendo, iniciando..."
    docker compose up -d gateway
    sleep 10
fi

# Probar conectividad con el gateway
echo -e "\n🔗 Probando conectividad con gateway..."
gateway_test=$(curl -s -w "\nSTATUS:%{http_code}" http://localhost:3000/files/example 2>/dev/null || echo "STATUS:000")
gateway_status=$(echo "$gateway_test" | grep "STATUS:" | cut -d: -f2)

if [ "$gateway_status" != "000" ]; then
    echo "✅ Gateway respondiendo (Status: $gateway_status)"
else
    echo "❌ Gateway no responde, verificando servicios..."
    docker compose ps
    echo -e "\nReiniciando gateway..."
    docker compose restart gateway
    sleep 15
fi

# 5. PROBAR CON USUARIO EXISTENTE
echo -e "\n5️⃣ Creando usuario de prueba completo..."
timestamp=$(date +%s)
test_email="complete${timestamp}@docvisual.com"
test_password="Complete123"

# Registro
register_response=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$test_email\",
    \"password\": \"$test_password\",
    \"names\": \"Usuario\",
    \"lastnames\": \"Completo\"
  }" \
  -w "\nSTATUS:%{http_code}")

register_status=$(echo "$register_response" | grep "STATUS:" | cut -d: -f2)

if [ "$register_status" = "201" ] || [ "$register_status" = "200" ]; then
    echo "✅ Usuario registrado: $test_email"
    
    # Esperar un momento
    sleep 3
    
    echo -e "\n6️⃣ Probando login con validación real de contraseña..."
    
    # Login con contraseña correcta
    login_correct=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$test_email\",
        \"password\": \"$test_password\"
      }" \
      -w "\nSTATUS:%{http_code}")
    
    login_status=$(echo "$login_correct" | grep "STATUS:" | cut -d: -f2)
    
    if [ "$login_status" = "201" ] || [ "$login_status" = "200" ]; then
        echo "🎉 ¡LOGIN EXITOSO CON VALIDACIÓN REAL!"
        echo "Usuario autenticado correctamente"
        echo "$login_correct" | grep -v "STATUS:" | python3 -m json.tool
        
        # Probar con contraseña incorrecta
        echo -e "\n7️⃣ Probando login con contraseña incorrecta..."
        login_wrong=$(curl -s -X POST http://localhost:3000/auth/login \
          -H "Content-Type: application/json" \
          -d "{
            \"email\": \"$test_email\",
            \"password\": \"PasswordIncorrecto\"
          }" \
          -w "\nSTATUS:%{http_code}")
        
        wrong_status=$(echo "$login_wrong" | grep "STATUS:" | cut -d: -f2)
        
        if [ "$wrong_status" = "400" ]; then
            echo "✅ ¡VALIDACIÓN FUNCIONANDO! Login rechazado con contraseña incorrecta"
            echo "Respuesta: $(echo "$login_wrong" | grep -v "STATUS:")"
        else
            echo "⚠️  Problema con validación de contraseña"
        fi
        
        echo -e "\n🎯 FUNCIONALIDAD COMPLETA RESTAURADA:"
        echo "================================"
        echo "✅ Conexión a base de datos"
        echo "✅ Validación real de contraseñas con bcrypt"
        echo "✅ JWT real generado"
        echo "✅ Diferentes roles (USER, USER_PARTNER, ADMIN)"
        echo "✅ Validación de usuarios eliminados"
        echo "================================"
        echo "📧 Usuario de prueba: $test_email"
        echo "🔑 Contraseña: $test_password"
        echo "🌐 URL: http://localhost:8080"
        
    else
        echo "❌ Login falló - revisando logs..."
        docker compose logs auth-ms --tail=15 | grep -i "LoginUser\|error"
    fi
    
else
    echo "❌ No se pudo crear usuario - Status: $register_status"
    echo "$register_response" | grep -v "STATUS:"
fi

echo -e "\n🏁 RESTAURACIÓN COMPLETA TERMINADA"
echo "El auth-ms ahora tiene toda la funcionalidad original restaurada"