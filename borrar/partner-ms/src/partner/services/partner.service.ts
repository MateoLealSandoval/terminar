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


@Injectable()
export class PartnerService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }
    onModuleInit() {
        this.$connect();

    }

    async update_user_partner(Create_user_partner: Create_user_partner) {
        try {
            const { id, specialists, names, lastnames, prepagadas, ...data } = Create_user_partner;
            const userData = await this.userDataPartner.findFirst({
                where: {
                    id
                }
            })
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
            );
            if (names && lastnames) {
                filteredData.name = `${names} ${lastnames}`;
            }
            if (userData) {

                const update_user_partner = await this.userDataPartner.update({
                    where: { id },
                    data: filteredData
                });

                const sendUthUpdate: auhPathcNameDto = {
                    names, lastnames, id: update_user_partner.id
                }
                const dataAuth = await firstValueFrom(
                    this.client.send('auth-ms.patch.names.user', sendUthUpdate)
                )

                if (prepagadas) {
                    console.log("prepagadas")
                    console.log(prepagadas)
                    await this.update_user_partner_prepagada(id, prepagadas)

                }


                if (specialists) {
                    const result_add_specialits = await this.update_user_partner_specialits(id, specialists)

                    return {
                        status: 200,
                        data_user: result_add_specialits,
                        auth: dataAuth
                    }
                }
                return {
                    status: 200,
                    data_user: update_user_partner
                }
            }

            const new_partner = await this.userDataPartner.create({
                data: {
                    id, ...filteredData,
                    services: {
                        create: [
                            {
                                name: 'PRIMERA_CONSULTA', // debe coincidir con el enum ServiceName PRIMERA_CONSULTA
                                price: 0
                            },
                            {
                                name: 'CONSULTA',  //
                                price: 0
                            }
                        ]
                    }
                }

            });
            const sendUthUpdate: auhPathcNameDto = {
                names, lastnames, id: new_partner.id
            }
            const dataAuth = await firstValueFrom(
                this.client.send('auth-ms.patch.names.user', sendUthUpdate)
            )
            if (specialists) {
                const result_add_specialists = await this.update_user_partner_specialits(id, specialists);
                return { status: 200, data_user: result_add_specialists };
            }

            return { status: 200, data_user: new_partner, auth: dataAuth };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    //this funtion filter profeccionals by speciality and city   
    async get_users_partners_filters(filters_specialist_dto: filters_specialist_dto) {
        try {

            const { specialitsFilters, page, limit, cityFilters, name } = filters_specialist_dto
            const specialistIds = specialitsFilters?.map(specialist => specialist.id);
            const cityIds = cityFilters?.map(city => city.id);
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;


            const andConditions: any[] = [];

            if (specialistIds?.length) {
                andConditions.push({ specialists: { some: { id: { in: specialistIds } } } });
            }

            if (cityIds?.length) {
                andConditions.push({ offices: { some: { cityId: { in: cityIds } } } });
            }

            if (name?.length) {
                andConditions.push({ name: { contains: name, mode: 'insensitive' } });
            }

            const whereFilter = andConditions.length ? { AND: andConditions } : {};
            // total datas
            const total = await this.userDataPartner.count({ where: whereFilter });
            // result datas and paginade
            const result = await this.userDataPartner.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: whereFilter,
                select: {
                    id: true,
                    name: true,
                    title: true,
                    description: true,
                    point: true,
                    perfilPhoto: true,
                    experience: true,
                    specialists: {
                        where: {
                            status: 'ACTIVE'
                        }
                    }
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
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async get_user_partner_detail(id: string) {
        try {
            const data = await this.userDataPartner.findFirst({
                where: {
                    id,

                },
                include: {
                    prepagadas:true,
                    specialists: true,
                    photos: true,
                    offices: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            latitude: true,
                            longitude: true,

                        }
                    },
                    services: {
                        where: {
                            status: 'ACTIVE'
                        }
                    }
                    ,

                }
            })

            if (!data) {
                throw new RpcException({
                    status: 400,
                    message: 'no se encontro el usuario'
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
    async get_user_partner_my_detail(id: string) {
        try {
            const data = await this.userDataPartner.findFirst({
                where: {
                    id,

                },
                include: {
                    prepagadas: true,
                    specialists: true,
                    photos: true,
                    offices: true,
                    services: {
                        where: {
                            status: 'ACTIVE'
                        }
                    }
                }
            })
            if (!data) {
                throw new RpcException({
                    status: 400,
                    message: 'no se encontro el usuario'
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
    async update_user_partner_specialits(id: string, specialitsdata: specialist_dto[]) {
        try {

            const find_user = await this.userDataPartner.findUnique({
                where: {
                    id
                }
            })
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No existe el usuario"
                })
            }
            const specialistIds = specialitsdata.map(s => s.id);
            const existingSpecialists = await this.specialist.findMany({
                where: {
                    id: {
                        in: specialistIds
                    }
                }
            });
            if (existingSpecialists.length !== specialitsdata.length) {
                const missingSpecialists = specialistIds.filter(
                    id => !existingSpecialists.some(s => s.id === id)
                );
                throw new RpcException({
                    status: 400,
                    message: `Los siguientes especialistas no existen: ${missingSpecialists.join(", ")}`
                });
            }
            const update_partner = await this.userDataPartner.update({
                where: {
                    id
                },

                data: {

                    specialists: {
                        set: specialitsdata.map(specialistId => ({ id: specialistId.id }))
                    }
                },
                include: {
                    specialists: true
                }
            });
            return {
                status: 200,
                data: update_partner
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async update_user_partner_prepagada(id: string, prepagadasDatas: specialist_dto[]) {
        try {
            if (!prepagadasDatas || prepagadasDatas.length === 0) {
                throw new RpcException({
                    status: 400,
                    message: "Debe proporcionar al menos un especialista"
                });
            }

            const find_user = await this.userDataPartner.findUnique({ where: { id } });
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No existe el usuario"
                });
            }

            const prepagadasIds = prepagadasDatas.map(s => s.id);
            const existingPrepagadas = await this.prepagadas.findMany({
                where: {
                    id: {
                        in: prepagadasIds
                    }
                }
            });

            if (existingPrepagadas.length !== prepagadasIds.length) {
                const missingSpecialists = prepagadasIds.filter(
                    id => !existingPrepagadas.some(s => s.id === id)
                );
                throw new RpcException({
                    status: 400,
                    message: `Los siguientes especialistas no existen: ${missingSpecialists.join(", ")}`
                });
            }

            const update_partner = await this.userDataPartner.update({
                where: { id },
                data: {
                    prepagadas: {
                        set: prepagadasDatas.map(p => ({ id: p.id }))
                    }
                },
                include: { prepagadas: true }
            });

            return {
                status: 200,
                data: update_partner
            };

        } catch (error) {
            console.error("Error actualizando usuario:", error);
            throw new RpcException({
                status: 400,
                message: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }


    async update_perfil_photo(update_perfil_photo: Update_user_partner_photo) {
        try {
            const find_user = await this.userDataPartner.findUnique({
                where: {
                    id: update_perfil_photo.id
                }
            })
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro el usuario"
                })
            }
            const update_user = await this.userDataPartner.update({
                where: {
                    id: update_perfil_photo.id
                },
                data: {
                    perfilPhoto: update_perfil_photo.perfil_photo
                }
            })
            return {
                status: 200,
                data: update_user
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async check_partner(id: string) {
        try {
            const partner = await this.userDataPartner.findFirst({
                where: {
                    id
                }
            })
            if (!partner) {
                throw new RpcException({
                    status: 400,
                    message: 'No existe este partner'
                })
            }
            return {
                data: true
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    // photos perfil 

    async add_perfil_photos_panel(photos_dto_body: photos_dto_body) {
        try {
            const { id, url } = photos_dto_body;
            const find_user = await this.userDataPartner.findFirst({
                where: {
                    id: id
                }
            })
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro el usuario"
                })
            }
            const newPhoto = await this.photosParnet.create({
                data: {
                    url: url,
                    UserDataPartner: {
                        connect: { id: id }
                    }
                }
            });

            return {
                status: 200,
                data: newPhoto
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }
    async clear_photo_user(photos_dto_body: photos_dto_body) {
        try {
            const { id, url } = photos_dto_body;
            const find_user = await this.userDataPartner.findFirst({
                where: {
                    id: id
                }
            })
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro el usuario"
                })
            }
            const newPhoto = await this.photosParnet.create({
                data: {
                    url,
                    UserDataPartner: {
                        connect: { id: id }
                    }
                }
            });

            return {
                status: 200,
                data: newPhoto
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async unlink_perfil_photo_panel(clear_photos_dto_body: clear_data) {
        try {
            const { id, idUser } = clear_photos_dto_body;
            const find_user = await this.userDataPartner.findFirst({
                where: { id: idUser }
            });
            if (!find_user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontró el usuario"
                });
            }

            const find_photo = await this.photosParnet.findFirst({
                where: {
                    id: id,
                    UserDataId: idUser

                }
            });

            if (!find_photo) {
                throw new RpcException({
                    status: 400,
                    message: "La foto no está vinculada a este usuario"
                });
            }
            await this.photosParnet.update({
                where: { id: id },
                data: {
                    UserDataId: null
                } // Desvincula la relación
            });

            return {
                status: 200,
                message: "Foto desvinculada correctamente"
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_basic_perfil_and_office(id: string, officeId: string) {
        try {
            const profeccional = await this.userDataPartner.findFirst({
                where: {
                    id,
                },
                select: {
                    id: true,
                    perfilPhoto: true,
                    name: true,
                    title: true,
                    specialists: true,
                    offices: {
                        where: {
                            id: officeId,
                        },
                    },
                    phone: true,
                },
            })
            return {
                status: 200,
                data: profeccional
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
}
