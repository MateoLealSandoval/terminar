import { Controller } from '@nestjs/common';
 
import { MessagePattern, Payload } from '@nestjs/microservices';
import {  get_shedules,   PutSheduleItemsOfficeDto,   ShedulesDto } from '../dto';
import { get_shedules_office } from '../dto/get_shedule_office';
import { ReservationSheduleService } from '../services';
 
 

@Controller()
export class ReservationSheduleController {
  constructor(private readonly reservationService: ReservationSheduleService) {}

  @MessagePattern( 'offices.example.reservation')
  registerUser(){
    return this.reservationService.example()
  }
 
  
  @MessagePattern( 'offices.create.reservation.shedule')
  create_shedule(@Payload() shedules:ShedulesDto){
    return this.reservationService.create_shedule(shedules)
  }
  @MessagePattern( 'get.offices.shedules.day')
  get_shedules(@Payload() get_shedules:get_shedules){
    return this.reservationService.get_shedules_office(get_shedules)
  }


  @MessagePattern('get.days.office.shedule')
  get_days_shedules(@Payload() get_shedules_office:get_shedules_office) {
    return this.reservationService.get_shedules_days_detail(get_shedules_office)
  }
  @MessagePattern('put.shedule.items.office.shedule')
  put_shedule_items(@Payload() put_shedule_items_office_dto:PutSheduleItemsOfficeDto) {
    return this.reservationService.put_shedules_day(put_shedule_items_office_dto)
  }
 
}
