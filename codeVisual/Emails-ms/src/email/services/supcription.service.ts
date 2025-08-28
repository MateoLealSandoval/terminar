import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';
import * as jwt from 'jsonwebtoken'

import { firstValueFrom } from 'rxjs';
import { sendEmail } from 'src/email/utils/send_email'
import { RegisterUserDto } from '../dto';
import { PaginationDto } from 'src/commont/pagination.dto';
import { create_supcription_dto } from '../dto/supcription/supcription.dto';

@Injectable()
export class SupcritionService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    private readonly logger = new Logger('email_microservice');
    private readonly jwtSecret = envs.jwtSecret;
    async onModuleInit() {
        await this.$connect();

    }



    async Supcription(createSupcriptionDto: create_supcription_dto) {
        try {
            const { email, name } = createSupcriptionDto;
            const isSubscribed = await this.suscription.findUnique({
                where: { email }
            })
            if (isSubscribed) {
                throw new Error('El usuario ya se encuentra supcrito al boletín informativo.')
            }
            const newSubscription = await this.suscription.create({
                data: {
                    name,
                    email
                }
            })
            return {
                status: 200,
                data: newSubscription
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async getExcel() {
        try {
            const suscriptions = await this.suscription.findMany();
            if (suscriptions.length === 0) {
                throw new Error('No hay suscripciones para exportar.');
            }
            return {
                status: 200,
                data: suscriptions
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async getSupcriptionPaginade(PaginationDto: PaginationDto) {
        try {
            const { page, limit } = PaginationDto;

            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const total = await this.suscription.count({});
            const result = await this.suscription.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                status: 200,
                data: result,
                meta: {
                    total,
                    page: currentPage,
                    lastPage: Math.ceil(total / perPage)
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async deleteSupcription(id: string) {
        try {
            const subscription = await this.suscription.findUnique({
                where: { id }
            });
            if (!subscription) {
                throw new Error('Suscripción no encontrada.');
            }
            await this.suscription.delete({
                where: { id }
            });
            return {
                status: 200,
                message: 'Suscripción eliminada correctamente.'
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async putSupcription(id: string, email: string, name: string) {
        try {
            // Verificar que la suscripción exista
            const subscription = await this.suscription.findUnique({
                where: { id }
            });

            if (!subscription) {
                throw new Error('Suscripción no encontrada.');
            }

            // Si el correo ha cambiado...
            if (subscription.email !== email) {
                // Verificar si ese nuevo correo ya está en uso por otra persona
                const existingEmail = await this.suscription.findUnique({
                    where: { email }
                });

                if (existingEmail) {
                    throw new Error('El correo electrónico ya está en uso por otra suscripción.');
                }
            }

            // Actualizar la suscripción
            const updatedSubscription = await this.suscription.update({
                where: { id },
                data: {
                    email,
                    name
                }
            });

            return {
                status: 200,
                data: updatedSubscription
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }


}
