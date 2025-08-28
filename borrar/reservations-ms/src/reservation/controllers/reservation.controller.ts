import { Controller } from '@nestjs/common';
import { ReservationService } from '../services';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { create_reservation_dto, updateReservationDto } from '../dto/reservation_dto';
import { CalificationUserDto } from '../dto/calification';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }


  @MessagePattern('reservations-ms.get.reservation.id.partner')
  get_reservation_partner_id(@Payload() { id, idpartner }: { id: string, idpartner: string }) {
    return this.reservationService.get_reservation_user_partner_id(idpartner, id)
  }

  @MessagePattern('reservations-ms.update.reservation.id')
  update_reservation_id(@Payload() updateReservation_dto: updateReservationDto) {
    return this.reservationService.update_reservation(updateReservation_dto)
  }

  @MessagePattern('create.reservation.user')
  create_token_reservation(@Payload() create_reservation_dto: create_reservation_dto) {
    return this.reservationService.create_reservation(create_reservation_dto)
  }

  @MessagePattern('reservation.get.profeccional.reservation')
  get_reservation_profeccional(@Payload() { id }: { id: string }) {
    return this.reservationService.get_reservations_profeccional(id)
  }
  @MessagePattern('reservation.get.user.reservation')
  get_reservation_user(@Payload() { id }: { id: string }) {
    return this.reservationService.get_reservations_user(id)
  }
  // @MessagePattern( 'confirm.token.user.rervation')
  // confirm_token_reservation(@Payload() confirm_token_reservation:confirm_token_reservation){
  //   return this.reservationService.validateApprovalToken(confirm_token_reservation)
  // }
  @MessagePattern('get.reservations.local.and.date')
  get_reservations_local_and_date(@Payload() { id, dates }: { id: string, dates: string[] }) {
    return this.reservationService.get_reservations_local_and_date(id, dates)
  }

  @MessagePattern('check.reservation.expired')
  check_reservation_expired() {
    return this.reservationService.check_reservation_expired()
  }

  @MessagePattern('cancel.reservation.by.user')
  cancel_reservation_by_user(@Payload() { idUser, reservationId }: { idUser: string, reservationId: string }) {
    return this.reservationService.cancel_reservation_user(idUser, reservationId)
  }




  @MessagePattern('cancel.reservation.by.profeccional')
  cancel_reservation_by_profeccional(@Payload() { idProfeccional, reservationId }: { idProfeccional: string, reservationId: string }) {
    return this.reservationService.cancel_reservation_professional(idProfeccional, reservationId)
  }

  @MessagePattern('calification.reservation.by.user')
  calification_reservation_by_user(@Payload() CalificationUserDto: CalificationUserDto) {
    return this.reservationService.calification_reservation_by_user(CalificationUserDto)
  }

  @MessagePattern('get.calification.score.by.profeccional')
  calification_reservation_by_profeccional(@Payload() { id }: { id: string }) {
    return this.reservationService.get_all_califications(id)
  }

  @MessagePattern('reservation-ms.get.count.all')
  get_count_reservations() {
    return this.reservationService.countReservations()
  }
}
