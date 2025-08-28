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

    constructor(private readonly jwtservice: JwtService,
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
                    message: 'El usuario existe'
                })
            }
            const editData = await this.user.update({
                where: {
                    id
                },
                data: {
                    names:names,lastnames:lastnames
                },
                select:{
                    email:true,
                    lastnames:true,
                    names:true,
                    id:true
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
                    message: 'El usuario existe'
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

            // const dataUser = await firstValueFrom(
            //     this.client.send('User.CreateUserData.User', {
            //         userId: Newuser.id,
            //     })
            // )


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
                    message: 'El usuario existe'
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
            const hashedPassword = await bcrypt.hash(password, 10); // Mejor usar await
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
                message: 'El usuario existe'

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


    async LoginUser(LoginUserDto: LoginUserDto) {
        try {
            const { email, password } = LoginUserDto;
            const user = await this.user.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'Usuario o contrasena no valida'
                })
            }
            if (user.role === 'DELETED_USER' || user.role === 'DELETED_USER_PARTNER') {
                throw new RpcException({
                    status: 400,
                    message: 'EL usuario fue borrado'
                })
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) {
                throw new RpcException({
                    status: 400,
                    message: 'Correo o contraseña inválidos'
                })
            }
            const { password: __, ...rest } = user;

            return {
                user: rest,
                token: await this.singJwt(rest)
            };

        } catch (error) {

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
    async refreshtoken(token:string){
         try {
            const { sub, iat, exp, ...user } = this.jwtservice.verify(token, {
                secret: envs.jwtSecret
            })
            const userdata = await this.user.findFirst({
                where:{
                    id:user.id
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
                    return: 400,
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
                    message: 'no existe el uruario '
                })
            }
            return {
                status: 200,
                data: user
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al obtener el usuario',
            });
        }
    }





    /**
     * todo services admin
     */
    async getInformationUsersAdmin(id: string) {
        try {
            const user = await this.user.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    role: true,
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'no existe el uruario '
                })
            }
            if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                throw new RpcException({
                    status: 403,
                    message: 'No tienes permisos para acceder a esta información',
                });
            }
            const numberProfessionals = await this.user.count({
                where: {
                    role: 'USER_PARTNER'
                }
            });
            const countUsers = await this.user.count({
                where: {
                    role: 'USER'
                }
            })
            const countPendingDelete = await this.user.count({
                where: {
                    role: 'PENDING_DELETE'
                }
            })
            const deleteUsers = await this.user.count({
                where: {
                    role: 'DELETED_USER'
                }
            })

            const deleteUsersPartner = await this.user.count({
                where: {
                    role: 'DELETED_USER_PARTNER'
                }
            })

            const reservations = await firstValueFrom(
                this.client.send('reservation-ms.get.count.all', {})
            );

            const pending_partner = await this.pendingPartner.count({
                where: {
                    status: StatusPendingPartner.PENDING
                }
            });


            return {
                status: 200,
                data: {
                    numberProfessionals: numberProfessionals,
                    countUsers: countUsers,
                    countPendingDelete: countPendingDelete,
                    deleteUsers: deleteUsers,
                    deleteUsersPartner: deleteUsersPartner,
                    reservations: reservations.data,
                    pendingPartner: pending_partner
                }
            }


        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al obtener el usuario',
            });
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.user.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    role: true,
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'no existe el uruario '
                })
            }
            if (user.role === 'USER') {
                await this.user.update({
                    where: { id: id },
                    data: {
                        role: 'DELETED_USER'
                    }
                })
            }
            if (user.role === 'USER_PARTNER') {
                await this.user.update({
                    where: { id: id },
                    data: {
                        role: 'DELETED_USER_PARTNER'
                    }
                })
            }
            return {
                status: 200,
                data: 'Usuario eliminado correctamente'
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al eliminar el usuario',
            });
        }
    }
    async getAllUsersPartners(PaginationDto: PaginationDto) {
        try {

            const { page, limit } = PaginationDto;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const rolesToFilter = [Role.USER_PARTNER, Role.DELETED_USER_PARTNER];
            const total = await this.user.count({
                where: {
                    role: {
                        in: rolesToFilter,
                    }
                }
            });

            const result = await this.user.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    role: {
                        in: rolesToFilter,
                    }
                },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    lastnames: true,
                    role: true,
                },
            });
            return {
                status: 200,
                data: result,
                meta: {
                    total,
                    page: currentPage,
                    lastPage: Math.ceil(total / perPage)
                }
            };
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al obtener los usuarios',
            });
        }
    }

    async getAllUsers(PaginationDto: PaginationDto) {
        try {

            const { page, limit } = PaginationDto;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const rolesToFilter = [Role.USER, Role.DELETED_USER];
            const total = await this.user.count({
                where: {
                    role: {
                        in: rolesToFilter,
                    }
                }
            });

            const result = await this.user.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    role: {
                        in: rolesToFilter,
                    }
                },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    lastnames: true,
                    role: true
                },
            });
            return {
                status: 200,
                data: result,
                meta: {
                    total,
                    page: currentPage,
                    lastPage: Math.ceil(total / perPage)
                }
            };
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error interno al obtener los usuarios',
            });
        }
    }

    async setStatusPartners(SetStatusPartnerDto: SetStatusPartnerDto) {
        try {
            const { id, status } = SetStatusPartnerDto;
            const user = await this.user.findFirst({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    email: true,
                    names: true,
                    role: true,
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'no existe el uruario '
                })
            }
            if (user.role !== 'USER_PARTNER' && user.role !== 'DELETED_USER_PARTNER') {
                throw new RpcException({
                    status: 403,
                    message: 'No tienes permisos para cambiar el estado del profesional',
                });
            }
            const role = user.role === 'USER_PARTNER' ? 'DELETED_USER_PARTNER' : 'USER_PARTNER';
            await this.user.update({
                where: { id: id },
                data: {
                    role: role
                }
            })
            return {
                status: 200,
                data: 'Estado del profesional actualizado correctamente'
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al establecer el estado del professional',
            });
        }
    }


    async setStatusUser(setStatusUserDto: setStatusUserDto) {
        try {
            const { id, status } = setStatusUserDto;
            const user = await this.user.findFirst({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'no existe el usuario '
                })
            }
            if (user.role !== 'USER' && user.role !== 'DELETED_USER') {
                throw new RpcException({
                    status: 403,
                    message: 'No tienes permisos para cambiar el estado del usuario',
                });
            }
            const role = user.role === 'USER' ? 'DELETED_USER' : 'USER';
            await this.user.update({
                where: { id: id },
                data: {
                    role: role
                }
            })
            return {
                status: 200,
                data: 'Estado del usuario actualizado correctamente'
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al establecer el estado del usuario',
            });
        }
    }
}
