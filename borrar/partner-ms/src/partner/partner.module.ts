import { Module } from '@nestjs/common';
import { PartnerService } from './services/partner.service';
import { PartnerController } from './controllers/partner.controller';
import { PartnerServiceSpecialist } from './services/partner.specialist.service';
import { NatsModule } from './transport/nast.module';
import { PartnerControllerSpecialits } from './controllers/partner.specialist.controller';
import { PartnerControllerOffice } from './controllers/partner.officines.controller';
import { PartnerServiceOffices } from './services/partner.offices.service';
import { PartnerPhotosController } from './controllers/partner.photos.controller';
import { PartnerServicesController } from './controllers/partner.services.controller';
import { PartnerServiceServices } from './services';
import { PartnerServicePrepagadas } from './services/partner.prepagadas.service';
import { PartnerControllerPrepagadas } from './controllers/partner.prepagadas.controller';
@Module({
  imports:[NatsModule],
  controllers: [PartnerController,PartnerControllerSpecialits,PartnerControllerOffice,PartnerPhotosController,PartnerServicesController, PartnerControllerPrepagadas],
  providers: [PartnerService,PartnerServiceSpecialist,PartnerServiceOffices,PartnerServiceServices,PartnerServicePrepagadas ],
})
export class PartnerModule {}
