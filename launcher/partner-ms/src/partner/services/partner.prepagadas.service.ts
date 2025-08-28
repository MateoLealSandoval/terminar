import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PrepagadasDto } from '../dto/prepagadas/prepagadas.dto';


@Injectable()
export class PartnerServicePrepagadas extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('prepagadasService');

    async onModuleInit() {
        await this.$connect();

    }


    async create_prepagadas(datas: PrepagadasDto[]) {
        try {
         

            for (const item of datas) {
                const {name,type} = item;
                const existing = await this.prepagadas.findFirst({
                    where: { name: name }
                });

                if (!existing) {
                    await this.prepagadas.create({
                        data: {
                            type:type ,
                            name: name,
                            status: 'ACTIVE'
                        }
                    });
                }
            }

            return {
                status: 200,
                data: "Prepagadas creadas correctamente"
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_all_prepagadas() {
        try {
            const all_specialist = await this.prepagadas.findMany({
                where: {
                    status: 'ACTIVE'
                }
            });

            return {
                status: 200,
                data: all_specialist
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    

    async delete_prepagadas(id: string) {
        try {
            const specialist = await this.prepagadas.findFirst({
                where: {
                    id: id
                }
            })
            if (!specialist) {
                throw new RpcException({
                    status: 400,
                    message: 'La especialidad no existe'
                })
            }

            const response = this.prepagadas.update({
                where: {
                    id
                },
                data: {
                    status: 'DELETED'
                }
            })
            return {
                data: response,
                status: 200
            }
        }
        catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async addUserPrepagadas(idUser: string, idPrepagada: string) {
        try {

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }



  
}
