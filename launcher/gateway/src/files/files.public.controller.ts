import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
 
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NATS_SERVICE } from 'src/config';
 

@Controller('files')
export class FilesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_PATH || 'public/uploads', // Carpeta donde se guardan los archivos
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname); // Extrae la extensión del archivo
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtName}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }), // 3MB
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }), // JPG o PNG
        ],
      }),
    ) file: Express.Multer.File,
    @Req() req: Request,
    
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { url: `${baseUrl}/uploads/${file.filename}` };
  }

 

  @Get('example')
  getExample(){
    return "hola mundo"
  }
}
