import { Controller } from '@nestjs/common';
import { PartnerServiceOffices } from '../services/partner.offices.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Create_office_dto } from '../dto/Offices-Dto';
import { Confirm_data } from '../interfaces/confirm.user.data.interface';


@Controller()
export class PartnerControllerOffice {
  constructor(
    private readonly partnerServiceOffices: PartnerServiceOffices,

  ) { }

  @MessagePattern('add.offices.partner')
  CreateSpecialist(@Payload() Create_office_dto: Create_office_dto) {
    return this.partnerServiceOffices.add_office_partner(Create_office_dto)

  }

  @MessagePattern('confirm.offices.partner')
  confirm_pecialist(@Payload() confirm_data: Confirm_data) {
    return this.partnerServiceOffices.confirm_office_partner(confirm_data)

  }

  @MessagePattern('get.citys.offices.partner')
  get_citys_partner() {
    return this.partnerServiceOffices.get_citys()
  }
}


