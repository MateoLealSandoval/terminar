import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PartnerService } from '../services/index';
 
import { clear_data, photos_dto_body } from '../dto/photos';
 
 
 

@Controller()
export class PartnerPhotosController {
  constructor(
    private readonly partnerService: PartnerService,
     
  ) {}

 
  @MessagePattern('add.partner.photos')
  add_users_partners_photos(@Payload() photos_dto_body:photos_dto_body ){
    return this.partnerService.add_perfil_photos_panel(photos_dto_body) 
  }
  @MessagePattern('clear.partner.photos.panel')
  clear_users_partners_photos(@Payload() clear_photos_dto_body:clear_data ){
    return this.partnerService.unlink_perfil_photo_panel(clear_photos_dto_body) 
  }
 
 

}


