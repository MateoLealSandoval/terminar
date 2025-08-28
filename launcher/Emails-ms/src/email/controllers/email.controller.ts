import { Controller } from '@nestjs/common';
import { EmailService } from '../services/email.service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { create_reservation_dto } from '../dto/create_reservation.dto';
import { SendEmailsDto } from '../dto';


@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {

  }
  @MessagePattern('create.reservation.token.email')
  create_reservation(@Payload() create_reservation_dto: create_reservation_dto) {
    return this.emailService.create_reservation_token(create_reservation_dto)
  }

  @MessagePattern('confirm.reservation.token.email')
  confirm_reservation(@Payload() payload: { token: string; code: number, userId: string }) {

    return this.emailService.validate_confirmation_code(payload.token, payload.code, payload.userId);
  }

  @MessagePattern('create.reset.password.user')
  reset_password(@Payload() payload: { email: string }) {
    return this.emailService.reset_password_by_email(payload.email)
  }

  @MessagePattern('update.reset.password.user')
  update_password(@Payload() payload: { token: string, password: string }) {
    return this.emailService.resetPassword(payload.token, payload.password)
  }

  @MessagePattern('email-ms.send.email.all')
  send_email_all(@Payload() SendEmailsDto: SendEmailsDto) {
    return this.emailService.sendEmail(SendEmailsDto)
  }

  @MessagePattern('email-ms.send.email.update.reservation')
  send_email_update_reservation(@Payload() SendEmailsDto: SendEmailsDto) {
    return this.emailService.sendEmailUpdateReservation(SendEmailsDto)
  }


}
