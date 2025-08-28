import { Module } from '@nestjs/common';
import { PartnerModule } from './partner/partner.module';
 

@Module({
  imports: [PartnerModule],
})
export class AppModule {}
