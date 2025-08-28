import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { Create_user_partner } from '../dto/Create_user_partner.dto';
import { PrepagadasId_dto, specialist_dto } from '../dto/Specialists-Dto/specialist_dto';
import { Update_user_partner_photo } from '../dto';
import { filters_specialist_dto } from '../dto/Specialists-Dto/filters_specialits.dto';
import { clear_data, photos_dto_body } from '../dto/photos';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { auhPathcNameDto } from '../dto/auth-ms/authPathNames.dto';
import { PartnerPaymentService, PaymentStatus } from './partner.payment.service';

@Injectable()
export class PartnerService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
        private readonly partnerPaymentService: PartnerPaymentService
    ) {
        super()
    }
    onModuleInit() {
        this.$connect();
    }

    async update_user_partner(Create_user_partner: Create_user_partner) {
        try {
            const { id, specialists, names, lastnames, prepagadas, ...data } = Create_user_partner;
            
            // Verificar si el partner tiene suscripción activa antes de permitir actualizaciones
            const subscriptionCheck = await this.partnerPaymentService.checkPartnerSubscription(id);
            if (!subscriptionCheck.data.hasActiveSubscription) {
                throw new RpcException({
                    status: 403,
                    message: 'Tu suscripción ha expirado o no tienes un plan activo. Por favor, renueva tu suscripción para continuar editando tu perfil.'
                });
            }

            const userData = await this.userDataPartner.findFirst({
                where: {
                    id
                }
            })
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
            );
            if (names && lastnames) {
                filteredData.name = `${names} ${lastnames}`
            }

            const sendUthUpdate: auhPathcNameDto = {
                names, lastnames, id
            }
            await firstValueFrom(
                this.client.send('auth-ms.patch.names.user', sendUthUpdate)
            )

            if (userData) {
                const updatedUserData = await this.userDataPartner.update({
                    where: { id },
                    data: filteredData
                });

                if (specialists && specialists.length > 0) {
                    const specialistOperations = specialists.map(specialist => ({
                        where: { id: specialist.id },
                        create: { id: specialist.id, name: specialist.name },
                        update: {}
                    }));

                    await this.userDataPartner.update({
                        where: { id },
                        data: {
                            specialists: {
                                connectOrCreate: specialistOperations
                            }
                        }
                    });
                }
                if (prepagadas && prepagadas.length > 0) {
                    const prepagadasOperations = prepagadas.map(prepagada => ({
                        where: { id: prepagada.id },
                        create: { 
                            id: prepagada.id, 
                            name: prepagada.name, 
                            type: prepagada.type || 'SITE' // Valor por defecto si no existe
                        },
                        update: {}
                    }));

                    await this.userDataPartner.update({
                        where: { id },
                        data: {
                            prepagadas: {
                                connectOrCreate: prepagadasOperations
                            }
                        }
                    });
                }

                return {
                    status: 200,
                    data: updatedUserData
                };
            } else {
                // Usuario no existe, crear nuevo
                const newUserData = await this.userDataPartner.create({
                    data: {
                        id,
                        ...filteredData
                    }
                });

                if (specialists && specialists.length > 0) {
                    const specialistOperations = specialists.map(specialist => ({
                        where: { id: specialist.id },
                        create: { id: specialist.id, name: specialist.name },
                        update: {}
                    }));

                    await this.userDataPartner.update({
                        where: { id },
                        data: {
                            specialists: {
                                connectOrCreate: specialistOperations
                            }
                        }
                    });
                }
                if (prepagadas && prepagadas.length > 0) {
                    const prepagadasOperations = prepagadas.map(prepagada => ({
                        where: { id: prepagada.id },
                        create: { 
                            id: prepagada.id, 
                            name: prepagada.name, 
                            type: prepagada.type || 'SITE' // Valor por defecto si no existe
                        },
                        update: {}
                    }));

                    await this.userDataPartner.update({
                        where: { id },
                        data: {
                            prepagadas: {
                                connectOrCreate: prepagadasOperations
                            }
                        }
                    });
                }

                return {
                    status: 200,
                    data: newUserData
                };
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_user_partner_detail(id: string) {
        try {
            const userPartner = await this.userDataPartner.findFirst({
                where: { id },
                include: {
                    specialists: true,
                    offices: true,
                    services: {
                        where: {
                            status: 'ACTIVE'
                        }
                    },
                    prepagadas: true
                }
            });

            if (!userPartner) {
                throw new RpcException({
                    status: 404,
                    message: 'Partner no encontrado'
                });
            }

            return {
                status: 200,
                data: userPartner
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_user_partner_my_detail(id: string) {
        try {
            const userPartner = await this.userDataPartner.findFirst({
                where: { id },
                include: {
                    specialists: true,
                    offices: {
                        include: {
                            city: true
                        }
                    },
                    services: {
                        where: {
                            status: 'ACTIVE'
                        }
                    },
                    prepagadas: true
                }
            });

            if (!userPartner) {
                throw new RpcException({
                    status: 404,
                    message: 'Partner no encontrado'
                });
            }

            // Calcular estado de suscripción
            const now = new Date();
            const isActive = userPartner.expiration_date ? new Date(userPartner.expiration_date) > now : false;
            
            const subscriptionData = {
                hasActiveSubscription: userPartner.payment_status === PaymentStatus.PAID && isActive,
                hasPaid: userPartner.payment_status === PaymentStatus.PAID,
                planType: userPartner.plan_type,
                paymentDate: userPartner.payment_date,
                expirationDate: userPartner.expiration_date,
                isActive
            };

            return {
                status: 200,
                data: {
                    ...userPartner,
                    subscription: subscriptionData
                }
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_users_partners_filters(filters_specialist_dto: filters_specialist_dto) {
        try {
            // Desestructurar con valores por defecto para evitar errores
            const { 
                city = null, 
                specialist = null, 
                service = null, 
                page = 1, 
                limit = 10 
            } = filters_specialist_dto as any;
            
            const skip = (page - 1) * limit;
            const take = limit;

            let whereConditions: any = {
                // Solo mostrar partners con suscripción activa
                payment_status: PaymentStatus.PAID,
                expiration_date: {
                    gt: new Date()
                }
            };

            if (city) {
                whereConditions.offices = {
                    some: {
                        city: {
                            name: {
                                contains: city,
                                mode: 'insensitive'
                            }
                        }
                    }
                };
            }

            if (specialist) {
                whereConditions.specialists = {
                    some: {
                        name: {
                            contains: specialist,
                            mode: 'insensitive'
                        }
                    }
                };
            }

            if (service) {
                whereConditions.services = {
                    some: {
                        name: {
                            contains: service,
                            mode: 'insensitive'
                        },
                        status: 'ACTIVE'
                    }
                };
            }

            const totalCount = await this.userDataPartner.count({
                where: whereConditions
            });

            const partners = await this.userDataPartner.findMany({
                where: whereConditions,
                include: {
                    specialists: true,
                    offices: {
                        include: {
                            city: true
                        }
                    },
                    services: {
                        where: {
                            status: 'ACTIVE'
                        }
                    },
                    prepagadas: true
                },
                skip: skip,
                take: take,
                orderBy: {
                    point: 'desc'
                }
            });

            return {
                status: 200,
                data: {
                    partners,
                    pagination: {
                        total: totalCount,
                        page: page,
                        limit: limit,
                        totalPages: Math.ceil(totalCount / limit)
                    }
                }
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async add_perfil_photos_panel(photos_dto_body: photos_dto_body) {
        try {
            // Extraer propiedades con nombres alternativos para compatibilidad
            const idUser = (photos_dto_body as any).idUser || (photos_dto_body as any).userId;
            const url = (photos_dto_body as any).url;

            if (!idUser || !url) {
                throw new RpcException({
                    status: 400,
                    message: "idUser y url son requeridos"
                });
            }

            // Verificar suscripción activa
            const subscriptionCheck = await this.partnerPaymentService.checkPartnerSubscription(idUser);
            if (!subscriptionCheck.data.hasActiveSubscription) {
                throw new RpcException({
                    status: 403,
                    message: 'Tu suscripción ha expirado o no tienes un plan activo. Por favor, renueva tu suscripción para continuar.'
                });
            }

            const user = await this.userDataPartner.findFirst({
                where: {
                    id: idUser
                }
            });

            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontró el usuario"
                });
            }

            const newPhoto = await this.photosParnet.create({
                data: {
                    url: url,
                    UserDataPartner: {
                        connect: { id: idUser }
                    }
                }
            });

            return {
                status: 200,
                data: newPhoto
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async unlink_perfil_photo_panel(clear_data: clear_data) {
        try {
            const { id, idUser } = clear_data;

            // Verificar suscripción activa
            const subscriptionCheck = await this.partnerPaymentService.checkPartnerSubscription(idUser);
            if (!subscriptionCheck.data.hasActiveSubscription) {
                throw new RpcException({
                    status: 403,
                    message: 'Tu suscripción ha expirado o no tienes un plan activo. Por favor, renueva tu suscripción para continuar.'
                });
            }

            const deletedPhoto = await this.photosParnet.delete({
                where: {
                    id: id,
                    UserDataId: idUser
                }
            });

            return {
                status: 200,
                data: deletedPhoto
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_basic_perfil_and_office(id: string, idOffice: string) {
        try {
            const partner = await this.userDataPartner.findFirst({
                where: { id },
                include: {
                    specialists: true,
                    offices: {
                        where: { id: idOffice },
                        include: {
                            city: true
                        }
                    }
                }
            });

            if (!partner) {
                throw new RpcException({
                    status: 404,
                    message: 'Partner u oficina no encontrada'
                });
            }

            return {
                status: 200,
                data: partner
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async check_partner(id: string) {
        try {
            const partner = await this.userDataPartner.findFirst({
                where: { id }
            });

            if (!partner) {
                return {
                    status: 404,
                    exists: false
                };
            }

            // Verificar suscripción
            const subscriptionCheck = await this.partnerPaymentService.checkPartnerSubscription(id);

            return {
                status: 200,
                exists: true,
                subscription: subscriptionCheck.data
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}