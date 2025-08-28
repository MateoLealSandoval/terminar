import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PartnerServiceSpecialist } from '../services/index';
 
import { create_specialist_dto } from '../dto/Specialists-Dto';
import { specialist_dto } from '../dto/Specialists-Dto/specialist_dto';
 

@Controller()
export class PartnerControllerSpecialits {
  constructor(
  
    private readonly partnerSerciceSpecialits: PartnerServiceSpecialist
  ) {}

  //@services  specialist
  @MessagePattern('create.specialist.partner')
  CreateSpecialist(@Payload() create_specialist_dto:create_specialist_dto){
    return this.partnerSerciceSpecialits.create_specialists(create_specialist_dto)
  }
  @MessagePattern('update.specialist.partner')
  update_specialist_partner(@Payload() specialist_dto:specialist_dto){
    return this.partnerSerciceSpecialits.update_specialist(specialist_dto)
  }
  
  @MessagePattern('delete.specialist.partner')
  delete_specialist_partner(@Payload() payload: { id: string }) {
    return this.partnerSerciceSpecialits.delete_specialist(payload.id);
  }

  @MessagePattern('all.specialist.partner')
  get_all_specialist_partner( ){
    return this.partnerSerciceSpecialits.get_all_specialist()
  }
 
    

}


