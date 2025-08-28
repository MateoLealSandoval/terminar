import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload  } from '@nestjs/microservices';
import { PartnerServiceServices } from '../services/index';
import { putServiceDto, ServicesDtoBody } from '../dto/Services-Dto';
import { clear_data } from '../dto/photos';
 
 
 
 

@Controller()
export class PartnerServicesController {
  constructor(
    private readonly PartnerServiceServices: PartnerServiceServices,
     
  ) {}

  @MessagePattern( 'user.add.services.partner')
  registerUser(@Payload() servicesDtoBody:ServicesDtoBody)  {
    return this.PartnerServiceServices.add_service_partner(servicesDtoBody)
  }
  @MessagePattern( 'user.put.services.partner') 
  put_Service(@Payload() putservice:putServiceDto)  {
    return this.PartnerServiceServices.put_my_service(putservice)
  }


  @MessagePattern( 'user.delete.services.partner') 
  deleterUser(@Payload() clear_data:clear_data)  {
    return this.PartnerServiceServices.delete_service_partner(clear_data)
  }

}


