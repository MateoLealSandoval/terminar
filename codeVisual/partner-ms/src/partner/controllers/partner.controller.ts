import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PartnerService } from '../services/index';
import { Create_user_partner } from '../dto';
import { filters_specialist_dto } from '../dto/Specialists-Dto';
import {  photos_dto_body } from '../dto/photos';
 
 
 

@Controller()
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
     
  ) {}

 
  //@Services partner
  @MessagePattern( 'update.partner.partner')
  create_partner(@Payload() Create_user_partner:Create_user_partner){
    return this.partnerService.update_user_partner(Create_user_partner)
  }

  @MessagePattern('get.partner.detail.user')
  get_partner_detail(@Payload() data:{id:string}){
    return this.partnerService.get_user_partner_detail(data.id)
  }
  @MessagePattern('get.partner.detail')
  get_partner_my_detail(@Payload() data:{id:string}){
    return this.partnerService.get_user_partner_my_detail(data.id)
  }

  @MessagePattern('get.partner.filters')
  get_users_partners_filters_controller(@Payload() filters_specialist_dto:filters_specialist_dto ){
    return this.partnerService.get_users_partners_filters(filters_specialist_dto)
  }
 
  //photos
  @MessagePattern('add.partner.photos')
  add_users_partners_photos(@Payload() photos_dto_body:photos_dto_body ){
    return this.partnerService.add_perfil_photos_panel(photos_dto_body) 
  }

  @MessagePattern('get.id.office.and.partner')
  get_id_office(@Payload() { id ,idOffice}: { id: string ,idOffice:string}){
    return this.partnerService.get_basic_perfil_and_office(id,idOffice)   
  } 

  @MessagePattern('check.id.partner')
  check_partner_id(@Payload() { id }: { id: string}){
    return this.partnerService.check_partner(id)
  }
 
}


