import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, resolve } from 'path';
import { Request } from 'express';

@Injectable()
export class PrivateFileService {
  private uploadPath = process.env.UPLOAD_PRIVATE_PATH || 'private/uploads';

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  saveFile(file: Express.Multer.File): string {
    const fileExtName = extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtName}`;
    const filePath = resolve(this.uploadPath, fileName);

    writeFileSync(filePath, file.buffer);

    return fileName;
  }

  getUrl(req: Request, filename: string): string {
    const baseUrl = `${req.protocol}:/${req.get('host')}`;
    return `${baseUrl}${this.uploadPath}/${filename}`;
  }
}
