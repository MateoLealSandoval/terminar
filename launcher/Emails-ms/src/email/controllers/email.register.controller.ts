import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EmailServiceRegister } from "../services/email.register.service";
import { RegisterUserDto } from "../dto";

@Controller()
export class EmailControllerRegister {
  constructor(private readonly emailRegister: EmailServiceRegister) {

  }
  @MessagePattern('create.user.token.email')
  create_user_email(@Payload() dataUser: RegisterUserDto) {
    return this.emailRegister.create_user(dataUser)
  }

  @MessagePattern('confirm.register.user.token.email')
  confirm_reservation(@Payload() payload: { token: string;}) {
    return this.emailRegister.validate_Register_token(payload.token);
  }
}