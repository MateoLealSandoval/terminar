import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Res, NotFoundException, UploadedFiles, UseGuards, ForbiddenException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { NATS_SERVICE } from 'src/config';
import { creatependingDtoComplete, CreateUserPartnerPendingDto } from './dto/create_user_partner_pending.dto';
import { PrivateFileService } from './private.services';
import { catchError, throwError } from 'rxjs';
import { AuthGuard } from 'src/guards/authGuards';
import { User } from 'src/auth/decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user.interfaces';


@Controller('files-privates')
export class PrivateFilesController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
        private readonly fileService: PrivateFileService) { }

    @Post('upload-private')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: process.env.UPLOAD_PRIVATE_PATH || 'private/uploads',
                filename: (req, file, cb) => {
                    const fileExtName = extname(file.originalname);
                    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtName}`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    uploadPrivateFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({
                        fileType: /image\/(jpeg|png)|application\/(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet)/,
                    })
                ],
            }),
        ) file: Express.Multer.File,
        @Req() req: Request,
    ) {

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return {
            filename: file.filename,
            mimeType: file.mimetype,
            url: `${baseUrl}/private/uploads/${file.filename}`
        };
    }

    @Get('view-private/:filename')
    @UseGuards(AuthGuard)
    viewPrivateFile(
        @User() user: CurrentUser,
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        const filePath = resolve(process.env.UPLOAD_PRIVATE_PATH || 'private/uploads', filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Archivo no encontrado');
        }

        return res.sendFile(filePath);
    }


    @Post('create-user-pending')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'side_front', maxCount: 1 },
            { name: 'side_back', maxCount: 1 },
        ]),
    )
    uploadId(
        @UploadedFiles()
        files: {
            side_front?: Express.Multer.File[];
            side_back?: Express.Multer.File[];
        },
        @Body() body: CreateUserPartnerPendingDto,
        @Req() req: Request,
    ) {
        const front = files.side_front?.[0];
        const back = files.side_back?.[0];
        if (!front || !back) {
            throw new NotFoundException('Ambos archivos son requeridos');
        }
        const frontFilename = this.fileService.saveFile(front);
        const backFilename = this.fileService.saveFile(back);
        const frontUrl = this.fileService.getUrl(req, frontFilename);
        const backUrl = this.fileService.getUrl(req, backFilename);
        if (!frontUrl || !backUrl) {
            throw new NotFoundException('No se guardaron los datos');
        }
        const send_data: creatependingDtoComplete = {
            back_side: backFilename,
            front_side: frontFilename,
            document: body.document,
            email: body.email,
            lastnames: body.lastnames,
            names: body.names,
            password: body.password,
            phone: body.phone,
            title: body.title
        }
        return this.client.send('auth-ms.register.partner.pending.user', send_data).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }
}
