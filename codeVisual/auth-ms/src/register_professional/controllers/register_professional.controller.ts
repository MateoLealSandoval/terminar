import { Controller } from '@nestjs/common';
import { RegisterProfessionalService } from '../services/register_professional.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserPartnerPendingDto } from '../dto/create_user_partner_pending.dto';
import { filtersPendingDto } from '../dto/filters_pendings.dto';

@Controller()
export class RegisterProfessionalController {
  constructor(private readonly registerProfessionalService: RegisterProfessionalService) { }


  @MessagePattern('auth-ms.register.partner.pending.user')
  registerUser(@Payload() CreateUserPartnerPendingDto: CreateUserPartnerPendingDto) {
    return this.registerProfessionalService.register_user_pending(CreateUserPartnerPendingDto)
  }

  @MessagePattern('auth-ms.get.users.pendings')
  get_users_pengins(@Payload() filtersPendingDto:filtersPendingDto){
    return this.registerProfessionalService.get_all_pendinsUsers(filtersPendingDto)
  }
  @MessagePattern('auth-ms.aprovate.user.pengins')
  aprivate_users(@Payload() {id}:{id:string}){
    return this.registerProfessionalService.aprovate_User(id)
  }
}
