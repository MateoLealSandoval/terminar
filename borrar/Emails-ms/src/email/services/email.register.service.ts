import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';
import * as jwt from 'jsonwebtoken'
 
import { firstValueFrom } from 'rxjs';
import { sendEmail } from 'src/email/utils/send_email'
import { RegisterUserDto } from '../dto';

@Injectable()
export class EmailServiceRegister extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    private readonly logger = new Logger('email_microservice');
    private readonly jwtSecret = envs.jwtSecret;
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }

    async create_user(RegisterUserDto: RegisterUserDto) {
        try {
            const { email, lastnames, names, password } = RegisterUserDto;
            // generate confirmation code

            const checkUser = await firstValueFrom(
                this.client.send('auth.verify.email.basic.user', { email })
            )
             
            if (checkUser.data === true) {
                throw new RpcException({
                    status: 400,
                    message: 'El usuario ya existe'
                })
            }
            const token = jwt.sign(
                { email, lastnames, names, password }, // Payload
                this.jwtSecret, // password secret 
                { expiresIn: '10m' }
            );
            const username = `${names} ${lastnames}`;
            const newHtml = this.generateEmailHtml_Register_user(  token, username);
            sendEmail(email, 'Te damos la bienvenida a DocVisual', newHtml);

            return {
                status: 200,
                token,

            };

        } catch (error) {

            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }

    async validate_Register_token(token: string) {
        try {
            // verify the token
            const decoded = jwt.verify(token, this.jwtSecret) as {
                email: string;
                lastnames: string;
                names: string;
                password: string;
            };
        
            const RegisterUserDto: RegisterUserDto = {
                email: decoded.email,
                lastnames: decoded.lastnames,
                names: decoded.names,
                password: decoded.password,
            }
       
            const registeruser = await firstValueFrom(
                this.client.send('auth.register.user', RegisterUserDto)
            )

            return {
                status: 200,
                message: 'El código de confirmación es válido',
                data:  registeruser
            };

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Token inválido',
            });
        }
    }




    private generateEmailHtml_Register_user(token: string,username:string): string {
        return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; width: 100%; background-color: #f9f9f9; padding: 20px;">
            <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <p style="color: #070707; font-size: 20px; font-weight: bold; margin: 0;">¡Cuidar de tu salud visual nunca ha sido tan fácil!</p>
                        <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746055258/tjmtqw8awfczaycthqco.png" alt="Logo" style="height: auto; margin: 20px 0;">
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <h1 style="font-weight: bold; font-size: 20px; margin: 20px 0;">Hola, ${username}</h1>
                        <p style="font-size: 16px; color: #333;">Gracias por registrarte en DocVisual – Directorio Online de Salud Visual.</p>
                        <p style="font-size: 16px; color: #333;">Accede a tu cuenta desde <strong>docvisual.co</strong> y:</p>
                        <p style="font-size: 16px; color: #333;">Para confirmar tu cuenta, haz clic en el siguiente enlace o botón:</p>
                        <a href="https://www.docvisual.co/createuser/${token}" style="display: inline-block; background-color: #36b6f1; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin: 20px 0;">Confirmar cuenta</a>
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
}
