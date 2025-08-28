import { Module } from '@nestjs/common';
 

import { NatsModule } from 'src/transport/nast.module';
import { ReservationShedulesController } from './reservations.shedules.controller';
import { ReservationsController } from './reservations.controller';


@Module({
  controllers: [ReservationShedulesController,ReservationsController],
   imports:[NatsModule],
})
export class ReservationsModule {}
