import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { Create_office_dto } from '../dto/Offices-Dto';
import { Confirm_data } from '../interfaces/confirm.user.data.interface';



@Injectable()
export class PartnerServiceOffices extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('PartnerServiceSpecialist');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }


    async add_office_partner(Create_office_dto: Create_office_dto) {
        try {
            const { description, idUser, latitude, longitude, nameCity, title, departament } = Create_office_dto;
            const user = await this.userDataPartner.findFirst({
                where: {
                    id: idUser
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'no se encontro el usuario'
                })
            }
            let city = await this.city.findFirst({
                where: { name: nameCity }
            });

            if (!city) {
                city = await this.city.create({
                    data: { name: nameCity }
                });
            }

            const newOffice = await this.officesParnet.create({
                data: {
                    title: title,
                    description: description,
                    longitude: longitude,
                    latitude: latitude,
                    departament: departament,
                    UserDataPartner: {
                        connect: { id: Create_office_dto.idUser }
                    },
                    city: {
                        connect: { id: city.id }
                    },
                }
            });

            return {
                status: 200,
                data: newOffice
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async confirm_office_partner(confirm_data: Confirm_data) {
        try {
            const { id, userId } = confirm_data;
            const data = await this.officesParnet.findFirst({
                where: {
                    id,
                    UserDataId: userId
                }
            })
            if (!data) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro la officina con el usuario"
                })
            }
            return {
                status: 200,
                data: data
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async get_id_office(id: string) {
        try {
            const office = await this.officesParnet.findFirst({
                where: {
                    id
                }
            })
            return {
                status: 200,
                data: office
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async get_citys(){
        try {
            const citys = await this.city.findMany()
            if(!citys){
                throw new RpcException({
                    status: 400,
                    message: 'error no se encontro ninguna ciudad'
                })
            }
            return {
                status:200,
                data:citys
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
}
