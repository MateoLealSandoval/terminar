import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient, SpecialistStatus } from '@prisma/client';
import { putServiceDto, ServicesDtoBody } from '../dto/Services-Dto';
import { RpcException } from '@nestjs/microservices';
import { clear_data } from '../dto/photos';



@Injectable()
export class PartnerServiceServices extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Module partner')
    onModuleInit() {
        this.$connect();

    }
    async example() {
        return "hola mundo"
    }


    async put_my_service(putServiceDto: putServiceDto) {
        const { id, idUser, price } = putServiceDto;
        const userdata = await this.userDataPartner.findFirst({
            where: {
                id: idUser
            },
            include: {
                services: true
            }
        })
        if (!userdata) {
            throw new RpcException({
                status: 400,
                message: "No se encontro el usuario "

            })
        }
        const serviceToUpdate = userdata.services.find(service => service.id === id);
        if (!serviceToUpdate) {
            throw new RpcException({
                status: 400,
                message: "No se encontró el servicio con ese ID para este usuario"
            });
        }
        const updatedService = await this.servicesPartner.update({
            where: { id },
            data: {
                price
            }
        });
        return {
            status: 200,
            data: updatedService
        };
    }



    async add_service_partner(ServicesDtoBody: ServicesDtoBody) {
        try {
            const { idUser, name, price } = ServicesDtoBody;
            const user = await this.userDataPartner.findFirst({
                where: {
                    id: idUser
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro el usuario "
                });
            }
            const new_service = await this.servicesPartner.create({
                data: {
                    
                    name: name,
                    price: price,
                    UserDataPartner: {
                        connect: { id: idUser }
                    }

                }
            })
            return {
                status: 200,
                data: new_service
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    async delete_service_partner(clear_data: clear_data) {
        try {
            const { id, idUser } = clear_data
            const data = await this.servicesPartner.update({
                where: {
                    id: id,
                    UserDataId: idUser
                },
                data: {
                    status: 'DELETED'
                }
            })
            return {
                status: 200,
                data: data
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }



}
