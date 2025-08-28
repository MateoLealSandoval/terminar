import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Favorites_dto } from "../dto/Favorites/Favorites.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { pagination_favorites } from "../dto/Favorites/Get.favorites.dto";
import { NATS_SERVICE } from "src/config";

@Injectable()
export class UsersFavoriteServices extends PrismaClient implements OnModuleInit {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
        super();
    }
    onModuleInit() {
        this.$connect();

    }


    async create_favorite(Favorites_dto: Favorites_dto) {
        try {
            const { ProfessionalId, userId } = Favorites_dto;
            // check professional
            const check_partner = await firstValueFrom(
                this.client.send('check.id.partner', {
                    id: ProfessionalId
                })
            )
            if (check_partner.data !== true) {
                throw new RpcException({
                    status: 400,
                    message: 'No existe el profeccional'
                });
            }
            const user = this.userData.findFirst({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: 'No se encontro el usuario'
                });
            }
            const checkFavorite = await this.favorites.findFirst({
                where: {
                    idProfessional: ProfessionalId,
                    userId: userId
                }
            })
            if (!checkFavorite) {
                // Crete favorite and add user
                const favorite = await this.favorites.create({
                    data: {
                        idProfessional: ProfessionalId,
                        user: {
                            connect: { id: userId },
                        },
                    },
                });
                return {
                    status: 200,
                    data: favorite
                }
            } else {
                throw new RpcException({
                    status: 400,
                    message: 'Ya tienes este usuario de favorito'
                });
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async delete_favorite(Favorites_dto: Favorites_dto) {
        const { userId, ProfessionalId } = Favorites_dto;

        try {
            // Verifica si existe el favorito y pertenece al usuario
            const favorite = await this.favorites.findFirst({
                where: {
                    userId: userId,
                    idProfessional: ProfessionalId,
                },
            });

            if (!favorite) {
                throw new RpcException({
                    status: 404,
                    message: 'No se encontró el favorito para este usuario',
                });
            }

            // Elimina el favorito
            await this.favorites.delete({
                where: { id: favorite.id },
            });

            return {
                status: 200,
                message: 'Favorito eliminado correctamente',
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }

    async get_favorites(pagination_favorites: pagination_favorites) {
        try {
            const { limit, page, idUser } = pagination_favorites;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            // total datas
            const total = await this.favorites.count({
                where: {
                    userId: idUser
                }
            });
            const result = await this.favorites.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    userId: idUser
                },
                select: {
                    id: true,
                    userId: true,
                    idProfessional: true
                }
            });



            const listProfessionals = await Promise.all(
                result.map(async (item) => {
                    try {
                        if (!item.idProfessional) throw new Error('idProfessional no definido');

                        const professional_item = await firstValueFrom(
                            this.client.send('get.partner.detail.user', { id: item.idProfessional })
                        );
                        const firstSpecialit = professional_item.data.specialists?.[0]?.name ?? null;

                       
                        return {
                            id: professional_item.data.id,
                            name: professional_item.data.name,
                            perfilPhoto: professional_item.data.perfilPhoto,
                            title: professional_item.data.title,
                            description: professional_item.data.description,
                            first:firstSpecialit
                        }
                    } catch (error) {
                        console.error(`Error al obtener el detalle del profesional ${item.idProfessional}:`, error.message);
                        return null; // o manejar como gustes
                    }
                })
            );

            return {
                status: 200,
                data: listProfessionals,
                meta: {
                    total,
                    page: currentPage,
                    lastPage: Math.ceil(total / perPage)
                }
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }
    async check_user_favorite(Favorites_dto: Favorites_dto) {
        try {
            const { ProfessionalId, userId } = Favorites_dto;
            const favorite = await this.favorites.findFirst({
                where: {
                    userId: userId,
                    idProfessional: ProfessionalId
                }
            })
            if (!favorite) {
                return {
                    status: 200,
                    data: false
                }
            } else {
                return {
                    status: 200,
                    data: true
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }
}
