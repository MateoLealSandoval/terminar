import { Controller } from '@nestjs/common';
import { EmailService } from '../services/email.service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { create_reservation_dto } from '../dto/create_reservation.dto';
import { getNotification, NotificationDto } from '../dto';


@Controller()
export class NotificationsController {
  constructor(private readonly emailService: EmailService) {

  }

  @MessagePattern('get.notifications.user')
  get_notifications_user(@Payload() getNotification: getNotification) {
    return this.emailService.getNotificationsUser(getNotification)
  }

  @MessagePattern('email-ms.create.notification.id.user')
  get_notification_id_user(@Payload() createNotification: NotificationDto) {
    return this.emailService.CreateNotification(createNotification)
  }

  @MessagePattern('get.notifications.pendings.user.number')
  get_notificationPendings(@Payload() {id}: {id:string}) {
    return this.emailService.getNotificationPendings(id)
  }
 

  @MessagePattern('get.notification.id.user')
  getNotificationUser(@Payload() {id,idUser} : { id: string, idUser: string }) {
    return this.emailService.getNotification(id,idUser)
  }

}
