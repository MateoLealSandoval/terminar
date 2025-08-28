import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupcritionService } from '../services/supcription.service';
import { PaginationDto } from 'src/commont/pagination.dto';
import { create_supcription_dto } from '../dto/supcription/supcription.dto';
 


@Controller()
export class SupcriptionController {
  constructor(private readonly serviceSupcription: SupcritionService) {

  }
 
  @MessagePattern('emails-ms.get.excel.data.admin')
  get_notifications_user(){
    return this.serviceSupcription.getExcel()
  }
  
  @MessagePattern('emails-ms.get.subscriber.users.admin')
  get_notification_id_user(@Payload() PaginationDto: PaginationDto){
    return this.serviceSupcription.getSupcriptionPaginade(PaginationDto)
  }

  @MessagePattern('emails-ms.create.subscriber.user')
    create_notification_user(@Payload() create_supcription_dto:create_supcription_dto){
        return this.serviceSupcription.Supcription(create_supcription_dto)
  }

  @MessagePattern('emails-ms.delete.subscriber.user')
  delete_notification_user(@Payload() {id} :{id:string}  ){
    return this.serviceSupcription.deleteSupcription(id)
  }

  @MessagePattern('emails-ms.update.subscriber.user')
  update_notification_user(@Payload() {id,email,name} :{id:string,email:string,name:string}){
    return this.serviceSupcription.putSupcription(id,email,name)
  }
}
 