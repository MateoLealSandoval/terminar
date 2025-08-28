import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { CreateUserPartnerPendingDto } from '../dto/create_user_partner_pending.dto';
import * as bcrypt from 'bcrypt';
import { filtersPendingDto } from '../dto/filters_pendings.dto';
import { firstValueFrom } from 'rxjs';
import { RegisterPartnerDto } from 'src/auth/dto';
@Injectable()
export class RegisterProfessionalService extends PrismaClient implements OnModuleInit {
    constructor(private readonly jwtservice: JwtService,
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }
    onModuleInit() {
        this.$connect();
    }
    

    async register_user_pending(createpartner: CreateUserPartnerPendingDto) {
        try {
            const { back_side, email, front_side, lastnames, names, password, phone, title, document } = createpartner;
            const check_email = await this.pendingPartner.findFirst({
                where: {
                    email
                }
            })
            if (check_email) {
                throw new RpcException({
                    status: 401,
                    message: `Ya existe una cuenta registrada con este correo ${email} `
                })
            }
            const new_partner_pending = await this.pendingPartner.create({
                data: {
                    email,
                    lastnames,
                    names,
                    password: bcrypt.hashSync(password, 10),
                    side_back: back_side,
                    side_front: front_side,
                    title,
                    phone,
                    document
                }
            })

            return {
                status: 200,
                data: new_partner_pending
            }

        } catch (error) {

            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async get_all_pendinsUsers(filters: filtersPendingDto) {
        try {
            const { page, limit, type } = filters;
            const perType = type ?? 'PENDING'
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;

            const total = await this.pendingPartner.count({
                where: {
                    status: perType
                }
            });

            const result = await this.pendingPartner.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    status: perType
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
                status: 400,
                message: error.message
            })
        }
    }

    async aprovate_User(id: string) {
        try {
            const user = await this.pendingPartner.findUnique({
                where: {
                    id,
                }
            });
            if (!user) {
                throw new RpcException({
                    status: 401,
                    message: 'no existe el uruario '
                })
            }
            let send_Data: RegisterPartnerDto = {
                phone: user.phone,
                names: user.names,
                email: user.email,
                lastnames: user.lastnames,
                document: user.document,
                title: user.title,
                password: user.password
            };

            const updateuser = await this.pendingPartner.update({
                where: {
                    id
                },
                data: {
                    status: 'ACCEPTED'
                }
            })

            await firstValueFrom(
                this.client.send('auth.register.partner', send_Data)
            );
     
            return {
                status: 200,
                data: updateuser
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

}

