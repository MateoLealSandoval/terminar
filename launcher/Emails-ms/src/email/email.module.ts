import { Module } from '@nestjs/common';
 
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service.service';
import { NatsModule } from './transport/nast.module';
import { EmailServiceRegister } from './services/email.register.service';
import { EmailControllerRegister } from './controllers/email.register.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { SupcriptionController } from './controllers/supcription.controller';
import { SupcritionService } from './services/supcription.service';
 

@Module({
  imports:[
    NatsModule,
  ],
  controllers: [EmailController,EmailControllerRegister,NotificationsController,SupcriptionController],
  providers: [EmailService,EmailServiceRegister,SupcritionService],
})
export class EmailModule {}
