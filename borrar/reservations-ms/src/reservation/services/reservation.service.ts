import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { create_reservation_dto } from '../dto/reservation_dto/create_reservation.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { formatDateParts, formatFullDateUTC } from 'src/utils';
import { CalificationUserDto } from '../dto/calification';
import { updateReservationDto } from '../dto/reservation_dto';
import { SendEmailsDto } from '../dto/emails/Send_Emails.dto';
import { NotificationDto } from '../dto/notification/Notification.dto';

@Injectable()
export class ReservationService extends PrismaClient implements OnModuleInit {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
        super();
    }
    private readonly logger = new Logger('ms-reservations');

    async onModuleInit() {
        await this.$connect();
    }

    async update_reservation(updateReservation_dto: updateReservationDto) {
        try {
            const { date, id, userId, idshedule } = updateReservation_dto;

            const reservation = await this.reservation.findUnique({
                where: {
                    id: id,
                    userId: userId
                }
            });

            if (!reservation) {
                throw new RpcException({
                    status: 400,
                    message: 'No se encontro la reserva'
                });
            }
            if (reservation?.status === 'COMPLETED') {
                throw new RpcException({
                    status: 400,
                    message: 'No se peude cambiar la reserva si ya fue completada'
                });
            }
            if (reservation.status === 'CANCELLED') {
                throw new RpcException({
                    status: 400,
                    message: 'No se puede actualizar una reserva que ya fue cancelada '
                });
            }
            const olddate = formatFullDateUTC(reservation.date);
            const newDate = formatFullDateUTC(date);
            const updated_reservation = await this.reservation.update({
                where: {
                    id: id
                },
                data: {
                    scheduleId: idshedule,
                    date: date
                }
            });
            const dataUser = await firstValueFrom(this.client.send('auth.get.basic.user.basic', { id: userId }));
            const dataPartner = await firstValueFrom(this.client.send('auth.get.basic.user.basic', { id: reservation.profecionalId }));

            const sendMessage: SendEmailsDto = {
                names: dataPartner.data.names,
                subject: 'Actualización de Reserva',
                email: dataPartner.data.email,
                text: `Hola, ${dataPartner.data.names},\n\n` +
                    `Tu reserva ha sido actualizada por el usuario ${dataUser.data.names}.\n\n` +
                    `Detalles de la actualización:\n` +
                    `Fecha anterior: ${olddate}\n` +
                    `Nueva fecha: ${newDate}\n` +
                    `Si tienes alguna pregunta, no dudes en contactarnos.\n\n` +
                    `Saludos,\nEquipo Doc Visual`
            }
            //send email
            await firstValueFrom(
                this.client.send('email-ms.send.email.update.reservation', sendMessage)
            );

            const sendNotification: NotificationDto = {
                userId: reservation.profecionalId,
                title: `Actualización de Reserva ${dataUser.data.names}`,
                message: `Hola,${dataPartner.data.names},\n\nTu reserva ha sido actualizada por el usuario ${dataUser.data.names}.\n\nDetalles de la reserva:\nFecha: ${formatDateParts(date)}\nHorario: ${idshedule}\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEquipo Doc Visual`
            }
            //create notification
            await firstValueFrom(
                this.client.send('email-ms.create.notification.id.user', sendNotification)
            );

            return {
                status: 200,
                data: updated_reservation
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }


    async create_reservation(create_reservation_dto: create_reservation_dto) {
        try {

            const { date, officeId, price, profecionalId, scheduleId, userId, payment } = create_reservation_dto;
            const new_reservation = await this.reservation.create({
                data: {
                    date,
                    officeId,
                    price,
                    profecionalId,
                    scheduleId,
                    userId,
                    payment: payment
                }
            })
            return {
                status: 200,
                data: new_reservation
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async get_reservation_user_partner_id(partnerId: string, id: string) {
        try {

            const reservation_user = await this.reservation.findFirst({
                where: {
                    profecionalId: partnerId,
                    scheduleId: id
                }
            })
            if (!reservation_user) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro la reservacion"
                });
            }
            const office = await firstValueFrom(
                this.client.send('get.id.office.and.partner', { id: reservation_user.profecionalId, idOffice: reservation_user.officeId })
            );
            const data_user = await firstValueFrom(
                this.client.send('auth.get.basic.user.basic', { id: reservation_user.userId })
            );
            return {
                status: 200,
                data: {
                    office: office.data,
                    user: data_user.data,

                }
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }


    async get_reservations_user(iduser: string) {
        try {
            const reservation_user = await this.reservation.findMany({
                where: {
                    userId: iduser
                }
            })
            if (!reservation_user) {
                throw new RpcException({
                    status: 400,
                    message: "no se encontro ninguna reserva para el usuario"
                });
            }
            const enrichedReservations = await Promise.all(

                reservation_user.map(async (item) => {
                    const office = await firstValueFrom(
                        this.client.send('get.id.office.and.partner', { id: item.profecionalId, idOffice: item.officeId })
                    );

                    // Retornar una nueva estructura combinada
                    return {

                        data: office.data,
                        date: formatDateParts(item.date),
                        price: item.price,
                        payment: item.payment,
                        status: item.status,
                        id: item.id,
                    };
                })
            );

            return {
                status: 200,

                data: enrichedReservations
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    async get_reservations_local_and_date(id: string, dates: string[]) {
        try {
            // Convertir las fechas proporcionadas a formato YYYY-MM-DD
            const formattedDates = dates.map(date => new Date(date).toISOString().split('T')[0]);

            // Obtener todas las reservas de la oficina
            const reservation_user = await this.reservation.findMany({
                where: {
                    officeId: id,
                    status: {
                        in: ['ACTIVE', 'COMPLETED', 'PENDING'],
                    },
                },
            });

            // Filtrar las reservas por fecha (ignorando la hora)
            const filteredReservations = reservation_user.filter(reservation => {
                const reservationDate = reservation.date.toISOString().split('T')[0]; // Convertir la fecha de la reserva a YYYY-MM-DD
                return formattedDates.includes(reservationDate);
            });

            if (filteredReservations.length === 0) {
                return {
                    status: 200,
                    data: [],
                };
            }

            return {
                status: 200,
                data: filteredReservations, // Devuelve las reservas filtradas
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }



    async get_reservations_profeccional(idProfeccional: string) {
        try {
            const reservations_profecional = await this.reservation.findMany({
                where: {

                    profecionalId: idProfeccional

                }
            })


            if (!reservations_profecional) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro ninguna reserva para este profecional"
                });
            }
            const enrichedReservations = await Promise.all(
                reservations_profecional.map(async (item) => {
                    const office = await firstValueFrom(
                        this.client.send('get.id.office.and.partner', { id: item.profecionalId, idOffice: item.officeId })
                    );
                    const data_user = await firstValueFrom(
                        this.client.send('auth.get.basic.user.basic', { id: item.userId })
                    );
                    // Retornar una nueva estructura combinada
                    return {
                        data: office.data,
                        datauser: data_user.data,
                        date: formatDateParts(item.date),
                        price: item.price,
                        status: item.status,
                    };
                })
            );


            return {
                status: 200,
                data: enrichedReservations
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    async check_reservation_expired() {
        try {
            const currentDate = new Date();
            const reservations = await this.reservation.findMany({
                where: {
                    status: 'ACTIVE',
                    date: {
                        lt: currentDate,

                    },
                },
            });

            if (reservations.length === 0) {
                return {
                    status: 200,
                    message: 'No hay reservas expiradas.',
                };
            }
            await this.reservation.updateMany({
                where: {
                    status: 'ACTIVE',
                    date: {
                        lt: currentDate,
                    },
                },
                data: {
                    status: 'PENDING',
                },
            });
            return {
                status: 200,
                message: 'Reservas expiradas actualizadas correctamente.',
                data: reservations,
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }
    async cancel_reservation_user(idUser: string, idReservation: string) {
        try {
            const reservation = await this.reservation.findFirst({
                where: {
                    id: idReservation,
                    userId: idUser
                }
            });
            if (!reservation) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro ninguna reserva para el usuario"
                });
            }
            if (reservation.status === 'CANCELLED' || reservation.status == 'COMPLETED' || reservation.status === 'PENDING') {
                throw new RpcException({
                    status: 400,
                    message: "No se puede cancelar una reserva que ya fue cancelada o finalizada"
                });
            }
            const currentDate = new Date();
            const reservationDate = new Date(reservation.date);
            const hoursDifference = (reservationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
            if (hoursDifference < 2) {
                throw new RpcException({
                    status: 400,
                    message: "Solo puedes cancelar la reserva con al menos 2 horas de anticipación"
                });
            }
            await this.reservation.update({
                where: {
                    id: idReservation
                },
                data: {
                    status: 'CANCELLED'
                }
            });
            return {
                status: 200,
                data: {
                    message: "reserva cancelada"
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }





    async calification_reservation_by_user(CalificationUserDto: CalificationUserDto) {
        const { idUser, reservationId, idProfeccional, recommends, service_specialist, recomendations_specialist, personal_attention, quality, time_service, time_waiting, site, ubication_and_comfort, comment } = CalificationUserDto
        try {
            const reservation = await this.reservation.findFirst({
                where: {
                    id: reservationId,
                    userId: idUser,
                    profecionalId: idProfeccional,
                    status: 'PENDING'
                }
            });
            if (!reservation) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro ninguna reserva para el usuario"
                });
            }
            if (reservation.status === 'CANCELLED' || reservation.status == 'COMPLETED') {
                throw new RpcException({
                    status: 400,
                    message: "No se puede calificar una reserva que ya fue cancelada o finalizada"
                });
            }
            await this.reservation.update({
                where: {
                    id: reservationId
                },
                data: {
                    status: 'COMPLETED',
                    calification: {
                        create: {
                            recommends,
                            service_specialist,
                            recomendations_specialist,
                            personal_attention,
                            quality,
                            time_service,
                            time_waiting,
                            site,
                            ubication_and_comfort,
                            comments: comment
                        }
                    }
                }
            });
            return {
                status: 200,
                message: "Calificacion realizada con exito",
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    async cancel_reservation_professional(idProfessional: string, idReservation: string) {
        try {

            const reservation = await this.reservation.findFirst({
                where: {
                    scheduleId: idReservation,
                    profecionalId: idProfessional
                }
            });
            console.log(reservation)
            if (!reservation) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro ninguna reserva para el usuario"
                });
            }
            if (reservation.status === 'CANCELLED' || reservation.status == 'COMPLETED') {
                throw new RpcException({
                    status: 400,
                    message: "No se puede cancelar una reserva que ya fue cancelada o finalizada"
                });
            }
            const currentDate = new Date();
            const reservationDate = new Date(reservation.date);
            const hoursDifference = (reservationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
            if (hoursDifference < 2) {
                throw new RpcException({
                    status: 400,
                    message: "Solo puedes cancelar la reserva con al menos 2 horas de anticipación"
                });
            }
            await this.reservation.update({
                where: {
                    id: reservation.id
                },
                data: {
                    status: 'CANCELLED'
                }
            });
            return {
                status: 200,
                data: {
                    message: "reserva cancelada"
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }


    async get_all_califications(idProfeccional: string) {
        try {
            const califications = await this.reservation.findMany({
                where: {
                    profecionalId: idProfeccional,
                    status: 'COMPLETED'
                },
                include: {
                    calification: true
                }
            });
            if (!califications) {
                throw new RpcException({
                    status: 400,
                    message: "No se encontro ninguna reserva para el usuario"
                });
            }
            const recommendsItems = califications.filter(item => item.calification?.recommends !== null);
            const avg_score_recommends = recommendsItems.length > 0
                ? recommendsItems.reduce((acc, item) => acc + item.calification!.recommends!, 0) / recommendsItems.length
                : 0;

            const serviceSpecialistItems = califications.filter(item => item.calification?.service_specialist !== null);
            const avg_score_service_specialist = serviceSpecialistItems.length > 0
                ? serviceSpecialistItems.reduce((acc, item) => acc + item.calification!.service_specialist!, 0) / serviceSpecialistItems.length
                : 0;

            const recommendationsSpecialistItems = califications.filter(item => item.calification?.recomendations_specialist !== null);
            const avg_score_recommendations_specialist = recommendationsSpecialistItems.length > 0
                ? recommendationsSpecialistItems.reduce((acc, item) => acc + item.calification!.recomendations_specialist!, 0) / recommendationsSpecialistItems.length
                : 0;

            const personalAttentionItems = califications.filter(item => item.calification?.personal_attention !== null);
            const avg_score_personal_attention = personalAttentionItems.length > 0
                ? personalAttentionItems.reduce((acc, item) => acc + item.calification!.personal_attention!, 0) / personalAttentionItems.length
                : 0;

            const qualityItems = califications.filter(item => item.calification?.quality !== null);
            const avg_score_quality = qualityItems.length > 0
                ? qualityItems.reduce((acc, item) => acc + item.calification!.quality!, 0) / qualityItems.length
                : 0;

            const timeServiceItems = califications.filter(item => item.calification?.time_service !== null);
            const avg_score_time_service = timeServiceItems.length > 0
                ? timeServiceItems.reduce((acc, item) => acc + item.calification!.time_service!, 0) / timeServiceItems.length
                : 0;

            const timeWaitingItems = califications.filter(item => item.calification?.time_waiting !== null);
            const avg_score_time_waiting = timeWaitingItems.length > 0
                ? timeWaitingItems.reduce((acc, item) => acc + item.calification!.time_waiting!, 0) / timeWaitingItems.length
                : 0;

            const siteItems = califications.filter(item => item.calification?.site !== null);
            const avg_score_site = siteItems.length > 0
                ? siteItems.reduce((acc, item) => acc + item.calification!.site!, 0) / siteItems.length
                : 0;

            const ubicationComfortItems = califications.filter(item => item.calification?.ubication_and_comfort !== null);
            const avg_score_ubication_and_comfort = ubicationComfortItems.length > 0
                ? ubicationComfortItems.reduce((acc, item) => acc + item.calification!.ubication_and_comfort!, 0) / ubicationComfortItems.length
                : 0;
            const comments = califications
                .filter(item => item.calification !== null && item.calification.comments && item.calification.comments.trim() !== '')
                .map(item => {
                    const score = (
                        (item.calification?.personal_attention ?? 0) +
                        (item.calification?.quality ?? 0) +
                        (item.calification?.recommends ?? 0) +
                        (item.calification?.recomendations_specialist ?? 0) +
                        (item.calification?.service_specialist ?? 0) +
                        (item.calification?.time_service ?? 0) +
                        (item.calification?.time_waiting ?? 0) +
                        (item.calification?.site ?? 0) +
                        (item.calification?.ubication_and_comfort ?? 0)
                    ) / 9;
                    return {
                        coment: item.calification!.comments!,
                        score: score,
                    }

                });
            const avgScores = [
                avg_score_recommends,
                avg_score_service_specialist,
                avg_score_recommendations_specialist,
                avg_score_personal_attention,
                avg_score_quality,
                avg_score_time_service,
                avg_score_time_waiting,
                avg_score_site,
                avg_score_ubication_and_comfort
            ];
            const total = avgScores.reduce((acc, score) => acc + score, 0) / avgScores.length;
            return {
                status: 200,
                data: {
                    avg_score_recommends,
                    avg_score_service_specialist,
                    avg_score_recommendations_specialist,
                    avg_score_personal_attention,
                    avg_score_quality,
                    avg_score_time_service,
                    avg_score_time_waiting,
                    avg_score_site,
                    avg_score_ubication_and_comfort,
                    comments: {
                        data: comments,
                        count: comments.length
                    },
                    total: total
                }
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async countReservations() {
        try {
            const CountReservations = await this.reservation.count({
            })
            return {
                status: 200,
                data: CountReservations
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

}
