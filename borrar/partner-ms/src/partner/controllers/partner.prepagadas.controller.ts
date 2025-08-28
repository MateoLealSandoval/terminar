import { Controller } from '@nestjs/common';


import { PartnerServicePrepagadas } from '../services/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrepagadasDto } from '../dto/prepagadas/prepagadas.dto';

 


@Controller()
export class PartnerControllerPrepagadas {
    constructor(
        private readonly partnerSercicePrepagadas: PartnerServicePrepagadas
    ) { }

    @MessagePattern('partner-ms.create.prepagada')
    clear_users_partners_photos(@Payload() {datas}:{datas:PrepagadasDto[]}) {
        return this.partnerSercicePrepagadas.create_prepagadas(datas)
    }

    
    @MessagePattern("partner-ms.get.prepagada")
    get_prepagadas(){
        return this.partnerSercicePrepagadas.get_all_prepagadas()
    }

    
}


