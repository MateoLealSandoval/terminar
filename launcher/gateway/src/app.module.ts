import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PartnerModule } from './partner/partner.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ReservationsModule } from './reservations/reservations.module';
import { EmailsModule } from './emails/emails.module';
 
 

@Module({
  imports: [AuthModule, UsersModule, PartnerModule, FilesModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOAD_PATH ? process.env.UPLOAD_PATH : join(__dirname, '..', 'public/uploads'),
      serveRoot: '/uploads', 
      
    }),
    ReservationsModule,
    EmailsModule,

  ],
 
})
export class AppModule {}
