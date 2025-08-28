import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { get_shedules, PutSheduleItemsOfficeDto, ShedulesDto } from '../dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeToMinutes } from '../utils/Time_to_minutes';
import { minutesToTime } from '../utils/minutes_to_time';
import { get_shedules_office } from '../dto/get_shedule_office';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class ReservationSheduleService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }
    private readonly logger = new Logger('ms-reservations');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }

    async example() {
        return "module reservation is Ok"
    }

    async create_shedule(shedulesdata: ShedulesDto) {
        try {
            const { intervalMinutes, officeId, schedules } = shedulesdata;
            let shedule = await this.scheduleData.findFirst({
                where: { officeId }
            });

            if (!shedule) {
                // Crear el schedule si no existe
                shedule = await this.scheduleData.create({
                    data: { officeId }
                });
            } else {
                // Si existe, eliminar los elementos asociados antes de insertar los nuevos
                await this.sheduleItem.deleteMany({
                    where: {
                        scheduleId: shedule.id,
                        day: shedulesdata.schedules.day
                    }
                });
            }
            shedulesdata.schedules.day

            const scheduleItems: {
                day: string;
                openTime: string;
                closeTime: string;
                scheduleId: string;
            }[] = [];

            const { day, openTime, closeTime } = schedules;
            let start = timeToMinutes(openTime);
            const end = timeToMinutes(closeTime);

            if (start >= end) {
                throw new RpcException({
                    status: 400,
                    message: `El horario de apertura (${openTime}) debe ser menor que el de cierre (${closeTime}) para el día ${day}.`
                });
            }

            while (start + intervalMinutes <= end) {
                const blockOpen = minutesToTime(start);
                const blockClose = minutesToTime(start + intervalMinutes);

                scheduleItems.push({
                    day,
                    openTime: blockOpen,
                    closeTime: blockClose,
                    scheduleId: shedule.id, // Usamos el ID del schedule encontrado o creado
                });

                start += intervalMinutes;
            }

            // Agregar los nuevos elementos al schedule existente
            await this.sheduleItem.createMany({
                data: scheduleItems
            });

            // Obtener el schedule con los nuevos items
            const updatedSchedule = await this.scheduleData.findUnique({
                where: { id: shedule.id },
                include: { items: true }
            });

            return {
                status: 200,
                data: updatedSchedule
            };
        } catch (error) {
            console.error(error);
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async put_shedules_day(pushSheduleList: PutSheduleItemsOfficeDto) {
        try {
            const { items, officeId } = pushSheduleList
            const schedule = await this.scheduleData.findUnique({
                where: { officeId: officeId },
                select: { id: true } // Solo necesitamos el `id`
            });
            if (!schedule) {
                throw new RpcException({
                    status: 404,
                    message: "No se encontró un ScheduleData para esta oficina."
                });
            }
            const updatedSchedules = await Promise.all(
                items.map(item =>
                    this.sheduleItem.update({
                        where: { id: item.id },
                        data: {
                            active: item.active
                        }
                    })
                )
            );

            return {
                status: 200,
                data: updatedSchedules
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }
    async get_shedules_office(get_shedules: get_shedules) {
        try {
            const { officeId, day } = get_shedules

            const shedules = await this.scheduleData.findMany({
                where: {
                    officeId: officeId
                },
                include: {
                    items: {
                        where: {
                            day
                        },
                        orderBy: {
                            openTime: 'asc'
                        }
                    }
                }
            })
            return {
                status: 200,
                data: shedules
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }

    }


    async get_shedules_days_detail(get_shedules_office: get_shedules_office) {
        try {
            const { officeId, Get_shedule_date } = get_shedules_office;

            // Crear un mapa de días a fechas para referencia rápida
            const dayToDateMap = Get_shedule_date.reduce((acc, item) => {
                acc[item.day] = item.date; // Asociar el día con su fecha
                return acc;
            }, {});

            const daysToFilter = Get_shedule_date.map(item => item.day);
            const datesFilter = Get_shedule_date.map(item => new Date(item.date));
            const shedule_office = await this.scheduleData.findMany({
                where: {
                    officeId,
                    
                },
                include: {
                    items: {
                        where: {
                            day: { in: daysToFilter },
                            // active: true,
                        },
                        orderBy: {
                            openTime: 'asc'
                        }
                    }
                }
            });

            if (!shedule_office) {
                throw new RpcException({
                    status: 404,
                    message: "No se encontró un ScheduleData para esta oficina."
                });
            }


            const reservationsdays = await firstValueFrom(
                this.client.send('get.reservations.local.and.date', { id: officeId, dates: datesFilter })
            )
          
            // Agrupar los horarios por día
            const groupedByDay = daysToFilter.reduce((acc, day) => {
                acc[day] = [];
                return acc;
            }, {});


            shedule_office.forEach(schedule => {
                schedule.items.forEach(item => {
                    if (groupedByDay[item.day]) {
                        // Combinar la fecha y la hora para comparar con las reservas
                        const combinedDateTime = new Date(`${dayToDateMap[item.day]}T${item.openTime}:00.000Z`);

                        const isReserved = Array.isArray(reservationsdays.data) && reservationsdays.data.some(reserver => {
                            if (!reserver.date) return false; // Ignorar elementos sin fecha
                            const reservationDate = new Date(reserver.date).toISOString(); // Convertir a ISO
                            const combinedDateISO = combinedDateTime.toISOString(); // Convertir a ISO

                            return reservationDate === combinedDateISO; // Comparar fechas en formato ISO
                        });
                        if (isReserved === false) {
                            groupedByDay[item.day].push({
                                id: item.id,
                                openTime: item.openTime,
                                closeTime: item.closeTime,
                                active: item.active,
                                date: combinedDateTime.toISOString(), // Fecha y hora combinadas
                                reserver: isReserved
                            });
                        } else {
                            groupedByDay[item.day].push({
                                id: item.id,
                                openTime: item.openTime,
                                closeTime: item.closeTime,
                                active: item.active,
                                date: combinedDateTime.toISOString(), // Fecha y hora combinadas
                                reserver: isReserved
                            });
                        }
                    }
                });
            });

            // Agregar las reservas a los días correspondientes
            return {
                status: 200,
                data: groupedByDay
            };
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

}
