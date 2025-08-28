import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { NatsModule } from 'src/transport/nast.module';
import { PartnerControllerSpecialits } from './partner.specialits.controller';
import { PartnerOfficesController } from './partner.offices.controller';
import { PartnerPhotosController } from './partner.photos.controller';
import { PartnerServicesController } from './partner.services.controller';
import {PartPrepagadaController} from './partner.prepagada.controller';
@Module({
  controllers: [PartnerController,PartnerControllerSpecialits,PartnerOfficesController,PartnerPhotosController,PartnerServicesController,PartPrepagadaController],
  imports:[NatsModule],
})
export class PartnerModule {}
