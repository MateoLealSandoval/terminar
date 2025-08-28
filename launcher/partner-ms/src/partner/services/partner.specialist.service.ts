import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient, SpecialistStatus } from '@prisma/client';

import { specialist_dto } from '../dto/Specialists-Dto/specialist_dto';
import { create_specialist_dto } from '../dto/Specialists-Dto';


@Injectable()
export class PartnerServiceSpecialist extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('PartnerServiceSpecialist');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }
    async create_specialists(CreateSpecialistDto: create_specialist_dto) {
        try {
            const { name } = CreateSpecialistDto;
            return {
                status: 200,
                data: await this.specialist.create({
                    data: {
                        name
                    }
                })
            }
        }
        catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async get_all_specialist() {
        try {
            const all_specialist = await this.specialist.findMany({
                where: {
                    status: 'ACTIVE'
                }
            });

            // Ordenar Optometría y Oftalmología al inicio
            const prioritized = ['Optometría', 'Oftalmología'];
            all_specialist.sort((a, b) => {
                const aPriority = prioritized.includes(a.name) ? 0 : 1;
                const bPriority = prioritized.includes(b.name) ? 0 : 1;
                return aPriority - bPriority;
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


    async update_specialist(specialist_dto: specialist_dto) {
        try {
            const { id, name, status } = specialist_dto;
            const validStatus = status as unknown as SpecialistStatus;
            const find_specialist = await this.specialist.findFirst({
                where: {
                    id
                }
            });
            if (!find_specialist) {
                throw new RpcException({
                    status: 400,
                    message: 'La especialidad no existe'
                })
            }
            const specialist = await this.specialist.update({
                where: {
                    id
                },
                data: {
                    name: name,
                    status: validStatus
                }
            })
            return {
                status: 200,
                data: specialist
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async delete_specialist(id: string) {
        try {
            const specialist = await this.specialist.findFirst({
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

            const response = this.specialist.update({
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


}
