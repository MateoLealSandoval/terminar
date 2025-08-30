import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PrismaClient, Role, StatusPendingPartner } from "@prisma/client";
import { LoginUserDto, RegisterUserDto, SetStatusPartnerDto, setStatusUserDto } from "./dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/interfaces/payload.interface";
import { envs, NATS_SERVICE } from "src/config";
import { RegisterPartnerDto } from "./dto/Register-partner.dto copy";
import { firstValueFrom } from "rxjs";
import { CreateUserPartnerDto } from "./dto/CreateUserPartner.dto";
import { PaginationDto } from "./commont/pagination.dto";
import { auhPathcNameDto } from "./dto/authPathNames.dto";

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    constructor(
        private readonly jwtservice: JwtService,
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    onModuleInit() {
        this.$connect();
    }

    async singJwt(Payload: JwtPayload) {
        return this.jwtservice.sign(Payload)
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        try {
            const { email, names, password, lastnames } = registerUserDto;
            const existingUser = await this.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new RpcException({
                    statusCode: 400,
                    message: "El usuario ya existe"
                });
            }
            const newUser = await this.user.create({
                data: {
                    email,
                    password: bcrypt.hashSync(password, 10),
                    names,
                    lastnames,
                    role: Role.USER
                }
            });
            const { password: _, ...rest } = newUser;
            return {
                user: rest,
                token: await this.singJwt(rest)
            };
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message
            });
        }
    }

    async LoginUser(loginUserDto: LoginUserDto) {
        try {
            const { email, password } = loginUserDto;
            const user = await this.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new RpcException({
                    statusCode: 400,
                    message: "Usuario no encontrado"
                });
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new RpcException({
                    statusCode: 400,
                    message: "Credenciales inválidas"
                });
            }
            const { password: _, ...rest } = user;
            return {
                user: rest,
                token: await this.singJwt(rest)
            };
        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message
            });
        }
    }
}
