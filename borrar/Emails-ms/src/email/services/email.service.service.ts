import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';
import * as jwt from 'jsonwebtoken'
import { create_reservation_dto } from '../dto/create_reservation.dto';
import { formatDateForCalendar, sendEmail } from 'src/email/utils/send_email'
import { firstValueFrom } from 'rxjs';
import { getNotification, NotificationDto, SendEmailsDto } from '../dto';
import { reservation_email_dto } from '../dto/reservations';
import { sendEmailEditReservation } from '../utils/messages.emails';
import { formatDateTimeEs, formatHumanDateCO } from '../utils/date';


@Injectable()
export class EmailService extends PrismaClient implements OnModuleInit {
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

    async sendEmail(SendEmailDto: SendEmailsDto) {
        try {
            const { email, subject, text, names } = SendEmailDto;
            const createdHtml = this.generateEmailHtml(names, email, subject, text);
            sendEmail('hola@docvisual.co', subject, createdHtml);
            return {
                status: 200,
                message: 'Email enviado correctamente',
            }
        } catch (error) {

            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async create_reservation_token(createReservationDto: create_reservation_dto) {
        try {
            const { date, officeId, payment, price, profecionalId, scheduleId, userId } = createReservationDto;
            // generate confirmation code
            const confirmationCode = Math.floor(1000 + Math.random() * 9000); // generate a 4 digit code
            const token = jwt.sign(
                { date, officeId, payment, price, profecionalId, scheduleId, confirmationCode, userId }, // Payload
                this.jwtSecret, // password secret 
                { expiresIn: '10m' }
            );

            //get user email
            const dataUser = await firstValueFrom(
                this.client.send('auth.get.basic.user.basic', {
                    id: userId,
                })
            );
            const newHtml = this.generateEmailHtml_reservation(confirmationCode, `${dataUser.data.names} ${dataUser.data.lastnames}`);

            sendEmail(dataUser.data.email, 'Confirmación de reserva', newHtml);

            return {
                status: 200,
                token,
                code: confirmationCode,
            };

        } catch (error) {

            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async reset_password_by_email(email: string) {
        try {

            const userByEmail = await firstValueFrom(
                this.client.send('auth.verify.email.basic.user', {
                    email: email,
                })
            );
            if (userByEmail.data == true) {
                const token = jwt.sign(
                    { email }, // Payload
                    this.jwtSecret, // password secret 
                    { expiresIn: '12h' }
                );
                const html = this.generateHtml_reset_password(token)
                sendEmail(email, "Restablecer la contraseña doc visual", html)
                return {
                    status: 200,
                    data: "correo enviado correctamente"
                }


            } else {
                throw new RpcException({
                    status: 400,
                    message: "No existe este correo"
                })
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as {
                email: string;
            };
            const resetResponse = await firstValueFrom(this.client.send('auth.reset.password.by.email', {
                email: decoded.email,
                password: newPassword
            }))
            return {
                status: 200,
                data: resetResponse
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async validate_confirmation_code(token: string, confirmationCode: number, idUser: string) {
        try {
            // verify the token
            const decoded = jwt.verify(token, this.jwtSecret) as {
                date: string;
                officeId: string;
                payment: string;
                price: string;
                profecionalId: string;
                scheduleId: string;
                confirmationCode: number;
                userId: string;
            };

            if (decoded.userId !== idUser) {
                throw new RpcException({
                    status: 400,
                    message: 'El id de usuario no coincide',
                });
            }


            // validate the confirmation code
            if (decoded.confirmationCode !== confirmationCode) {
                throw new RpcException({
                    status: 400,
                    message: 'El código de confirmación no coincide',
                });
            }
            const reservationdata: create_reservation_dto = {
                date: decoded.date,
                officeId: decoded.officeId,
                payment: decoded.payment,
                price: Number(decoded.price),
                profecionalId: decoded.profecionalId,
                scheduleId: decoded.scheduleId,
                userId: decoded.userId
            }

            const reservation = await firstValueFrom(
                this.client.send<ReservationResponseDto>('create.reservation.user', reservationdata)
            )


            const dateresponse = new Date(reservation.data.date);
            const endDate = new Date(dateresponse); // Copia de la fecha inicial
            endDate.setMinutes(dateresponse.getMinutes() + 30);

            const startDateFormatted = formatDateForCalendar(dateresponse);
            const startDateHumand = formatHumanDateCO(dateresponse);
            const endDateFormatted = formatDateForCalendar(endDate);
            const endDateHumand = formatHumanDateCO(endDate);



            // Agregar 30 minuto
            const year = dateresponse.getUTCFullYear(); // Año
            const month = dateresponse.getUTCMonth() + 1; // Mes (0-11, por eso se suma 1)
            const day = dateresponse.getUTCDate(); // Día
            const hours = dateresponse.getUTCHours(); // Hora
            const minutes = dateresponse.getMinutes();
            if (reservation.status !== 200) {
                throw new RpcException({
                    status: 400,
                    message: 'No se pudo crear la reserva',
                });
            }
            const dataUser = await firstValueFrom(
                this.client.send('auth.get.basic.user.basic', {
                    id: decoded.userId,
                })
            );
            const dataProfessional = await firstValueFrom(
                this.client.send('auth.get.basic.user.basic', {
                    id: decoded.profecionalId
                })
            )
            const office = await firstValueFrom(
                this.client.send<ProfessionalResponse>('get.id.office.and.partner', { id: reservation.data.profecionalId, idOffice: reservation.data.officeId })
            );
            // Validar que office.offices[0] exista


            const namePorfeccional = `${dataProfessional.data.names}  ${dataProfessional.data.lastnames}`
            const nameUser = `${dataUser.data.names}  ${dataUser.data.lastnames}`
            if (!office || !Array.isArray(office.data.offices) || office.data.offices.length === 0) {
                throw new RpcException({
                    status: 400,
                    message: 'No se encontraron oficinas asociadas al profesional',
                });
            }
            const location = `${office.data.offices[0].description}`;
            const cordinates = `${office.data.offices[0].latitude}, ${office.data.offices[0].longitude}`;
            const safeLocation = encodeURIComponent(location);
            const datetext = formatDateTimeEs(year, month, day, hours, minutes)
            const html = this.generateEmailHtml_remember(
                office.data.name,
                day,
                month,
                year,
                hours,
                location,
                reservation.data.payment,
                startDateFormatted,
                endDateFormatted,
                safeLocation,
                namePorfeccional,
                cordinates,
                datetext
            );

            const htmlProfessional = this.generateEmailHtml_remember(
                office.data.name,
                day,
                month,
                year,
                hours,
                location,
                reservation.data.payment,
                startDateFormatted,
                endDateFormatted,
                safeLocation,
                nameUser,
                cordinates,
                datetext
            );

            sendEmail(dataUser.data.email, 'Confirmacion de tu cita en DocVisual', html);
            sendEmail(dataProfessional.data.email, 'Cita programada Doc visual', htmlProfessional)

            const createNotificationUser: NotificationDto = {
                title: "Cita Programada",
                message: `Tienes una cita con el optómetra ${namePorfeccional} en la fecha ${startDateHumand}`,
                userId: decoded.userId
            }
            const createNotificationProfessional: NotificationDto = {
                title: "Cita Programada",
                message: `Tienes una cita con el usuario ${dataUser.data.names} en la fecha ${startDateHumand}`,
                userId: decoded.profecionalId
            }
            this.CreateNotification(createNotificationUser)
            this.CreateNotification(createNotificationProfessional)

            const responsetext = `oficina:${location} , fecha:${datetext} ,con el profesional ${office.data.name} `
            return {
                status: 200,
                message: 'El código de confirmación es válido',
                data: responsetext
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Token inválido',
            });
        }
    }



    private generateEmailHtml(
        username: string,
        email: string,
        subject: string,

        text: string,

    ): string {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes es 0-indexado
        const year = now.getFullYear();
        return `
    <div
      style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; width: 100%; background-color: #f9f9f9; padding: 20px;">
      <table style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <tr>
          <td style="text-align: center; padding: 20px;">
            <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746028928/ibtjroma4sgyx55erswj.png"
              alt="Logo" style="max-width: 200px; margin-bottom: 20px;">
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <p style="color: #202020; font-size: 40px; font-weight: bold; margin: 0;">${subject}</p>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <p style="color: #202020; font-size: 30px; font-weight: bold; margin: 0;">Cita ${day}/${month}/${year}</p>
 
              <div style="text-align: left; margin: 0 auto; max-width: 400px;">
                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                  <h1 style="font-size: 16px;">Nombre:</h1>
                  <p style="font-size: 16px; color: #333; margin: 0;">${username}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                  <h1 style="font-size: 16px;">Correo:</h1>
                  <p style="font-size: 16px; color: #333; margin: 0;">${email}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                  <h1 style="font-size: 16px;">Asunto:</h1>
                  <p style="font-size: 16px; color: #333; margin: 0;">${text}</p>
                </div>
              </div>
             
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding: 20px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #888;">Has recibido este email porque utilizas nuestros servicios.
              Este es un email transaccional, lo que significa que está vinculado a alguna de las acciones que
              hayas realizado en DocVisual. Si necesitas más información, puedes contactarnos a través del
              email: <a href="mailto:hola@docvisual.co"
                style="color: #36b6f1; text-decoration: none;">hola@docvisual.co</a></p>
            <p style="font-size: 12px; color: #888;">DocVisual S.A.S, Bogotá, Colombia</p>
          </td>
        </tr>
      </table>
    </div>
  `;
    }




    private generateEmailHtml_remember(
        userName: string,
        day: number,
        month: number,
        year: number,
        hour: number,
        adress: string,
        payment: string,
        startDate: string,
        endDate: string,
        consultorio: string,
        nameProfessional: string,
        cordinates: string,
        datetext: string
    ): string {

        const rawDate = new Date(year, month - 1, day, hour);
        const formattedDate = rawDate.toLocaleString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });


        return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; width: 100%; background-color: #f9f9f9; padding: 20px;">
            <table style="max-width: 600px; margin: 0 auto;   border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746028928/ibtjroma4sgyx55erswj.png" alt="Logo" style="max-width: 200px; margin-bottom: 20px;">
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <p style="color: #202020; font-size: 40px; font-weight: bold; margin: 0;">Resumen de tu cita</p>
                        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                            <p style="color: #202020; font-size: 30px; font-weight: bold; margin: 0;">Cita ${formattedDate}</p>
                            <p style="color: #202020; font-size: 30px; font-weight: bold; margin: 0;">${userName}</p>
                            <div style="text-align: left; margin: 0 auto; max-width: 400px;">
                               <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746126244/eroqnvwidtdcjdhaacis.png" alt="Icono" style="width: 24px; height: 24px;">
                                    <p style="font-size: 16px; color: #333; margin: 0;">${formattedDate}</p>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746118354/bpflugsoyr6mqenlmdoz.png" alt="Icono" style="width: 24px; height: 24px;">
                                    <p style="font-size: 16px; color: #333; margin: 0;">${adress}</p>
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                                    <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746118354/ovbggchqfzj3v4wvtght.png" alt="Icono" style="width: 24px; height: 24px;">
                                    <p style="font-size: 16px; color: #333; margin: 0;">${payment}</p>
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${nameProfessional}+cita&dates=${startDate}/${endDate}&details=${consultorio} , fecha:${datetext} ,con el profesional ${nameProfessional}  &location=${cordinates}" 
                                   target="_blank" 
                                   style="display: inline-block; padding: 10px 20px; background-color: #36b6f1; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                    Agregar al calendario
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 20px; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">Has recibido este email porque utilizas nuestros servicios. Este es un email transaccional, lo que significa que está vinculado a alguna de las acciones que hayas realizado en DocVisual. Si necesitas más información, puedes contactarnos a través del email: <a href="mailto:hola@docvisual.co" style="color: #36b6f1; text-decoration: none;">hola@docvisual.co</a></p>
                        <p style="font-size: 12px; color: #888;">DocVisual S.A.S, Bogotá, Colombia</p>
                    </td>
                </tr>
            </table>
        </div>`;
    }



    private generateEmailHtml_reservation(confirmationCode: number, userName: string): string {
        return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; width: 100%; background-color: #f9f9f9; padding: 20px;">
            <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746028928/ibtjroma4sgyx55erswj.png" alt="Logo" style="max-width: 200px; margin-bottom: 20px;">
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <p style="color: #36b6f1; font-size: 20px; font-weight: bold; margin: 0;">Hola ${userName},</p>
                        <p style="font-size: 16px; color: #333; margin: 10px 0;">Gracias por confiar en nosotros. Tu código de confirmación de cita es:</p>
                        <p style="font-size: 35px; font-weight: bold; color: #333; margin: 20px 0;">${confirmationCode}</p>
                        <p style="font-size: 16px; color: #333; margin: 10px 0;">Utiliza este código para confirmar tu reserva.</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 20px; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">Has recibido este email porque utilizas nuestros servicios. Este es un email transaccional, lo que significa que está vinculado a alguna de las acciones que hayas realizado en DocVisual. Si necesitas más información, puedes contactarnos a través del email: <a href="mailto:hola@docvisual.co" style="color: #36b6f1; text-decoration: none;">hola@docvisual.co</a></p>
                        <p style="font-size: 12px; color: #888;">DocVisual S.A.S, Bogotá, Colombia</p>
                    </td>
                </tr>
            </table>
        </div>
        `;
    }


    private generateHtml_reset_password(tokenreset: string) {
        const url = "https://www.docvisual.co/reset/"
        const urlAndToken = url + tokenreset
        return `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 30px;">
            <tr>
                <td>
                    <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746028928/ibtjroma4sgyx55erswj.png" alt="Logo" style="max-width: 150px; margin-bottom: 30px;">
                    <h2 style="color: #333;">¿Olvidaste tu contraseña?</h2>
                    <p style="color: #555; font-size: 16px;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para continuar con el proceso.
                    </p>
                    <div style="margin: 30px 0;">
                        <a href="${urlAndToken}" target="_blank"
                            style="display: inline-block; padding: 12px 24px; background-color: #36b6f1; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Restablecer contraseña
                        </a>
                    </div>
                    <p style="color: #888; font-size: 14px;">
                        Si no solicitaste este cambio, puedes ignorar este correo.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 30px; font-size: 12px; color: #999;">
                    DocVisual S.A.S - Bogotá, Colombia<br>
                    ¿Necesitas ayuda? Escríbenos a <a href="mailto:hola@docvisual.co" style="color: #36b6f1; text-decoration: none;">hola@docvisual.co</a>
                </td>
            </tr>
        </table>
    </div>`
    }
    // notifications 
    async getNotificationPendings(id: string) {
        try {
            if (!id) {
                throw new RpcException({
                    status: 400,
                    message: 'El ID del usuario es requerido',
                });
            }

            const total = await this.notification.count({
                where: {
                    userId: id,
                    state: 'CLOSE', // Asegúrate que el valor 'CLOSE' es correcto según tu modelo
                },
            });

            return {
                status: 200,
                data: total,
            };
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: error?.message || 'Error interno al contar notificaciones pendientes',
            });
        }
    }




    async getNotificationsUser(getNotification: getNotification) {
        try {
            const { idUser, limit, page } = getNotification;
            const currentPage = page ?? 1;
            const perPage = limit ?? 10;
            const total = await this.notification.count({
                where: {
                    userId: idUser
                }
            });
            const result = await this.notification.findMany({
                skip: (currentPage - 1) * perPage,
                take: perPage,
                where: {
                    userId: idUser
                },
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
                message: error.message || 'Token inválido',
            });
        }
    }
    /**
     * * create notification
     * ! create new notification state init close
     * @param NotificationDto
     */
    async CreateNotification(NotificationDto: NotificationDto) {
        try {
            const { message, title, userId } = NotificationDto;
            /**
             * ! check userId
             */
            const dataUser = await firstValueFrom(
                this.client.send('auth.get.basic.user.basic', {
                    id: userId,
                })
            );
            if (dataUser.status !== 200) {
                throw new RpcException({
                    status: 400,
                    message: 'no se encontro el usuario',
                });
            }
            const newNotification = await this.notification.create({
                data: {
                    message: message,
                    title: title,
                    userId: userId,
                    state: 'CLOSE'
                }
            })
            return {
                status: 200,
                data: newNotification
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Token inválido',
            });
        }
    }
    async getNotification(id: string, userId: string) {
        try {
            const notification = await this.notification.findFirst({
                where: {
                    id: id,
                    userId: userId
                }
            });
            if (!notification) {
                throw new RpcException({
                    status: 400,
                    message: 'No se encontró la notificación con el usuario respectivo.'
                });
            }
            if (notification.state === 'CLOSE') {
                await this.notification.update({
                    where: {
                        id: id,
                        userId: userId
                    },
                    data: {
                        state: 'OPEN'
                    }
                })
            }
            return {
                status: 200,
                data: notification
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Token inválido',
            });
        }
    }


    async sendEmailUpdateReservation(SendEmailDto: SendEmailsDto) {
        try {
            const { subject, email } = SendEmailDto;
            const createHtml = sendEmailEditReservation(SendEmailDto);
            await sendEmail(email, subject ? subject : "Actualización de reserva. ", createHtml)
            return {
                status: 200,
                message: 'Email enviado correctamente',
            }
        } catch (error) {

            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }




}
