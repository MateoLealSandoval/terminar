import { Module } from '@nestjs/common';
 
 
import { NatsModule } from './transport/nast.module';
import { ReservationController, ReservationSheduleController } from './controllers';
import { ReservationService, ReservationSheduleService } from './services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[NatsModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })

  ],
  controllers: [ReservationController,ReservationSheduleController],
  providers: [ReservationSheduleService,ReservationService],
})
export class ReservationModule {}
