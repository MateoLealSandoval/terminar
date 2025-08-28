import { Module } from '@nestjs/common';
import { FilesController } from './files.public.controller';
import { NatsModule } from 'src/transport/nast.module';
import { PrivateFilesController } from './files.private.controller';
import { PrivateFileService } from './private.services';


@Module({
  controllers: [FilesController, PrivateFilesController],
  imports: [NatsModule],
  providers: [PrivateFileService],
 
})
export class FilesModule { }
