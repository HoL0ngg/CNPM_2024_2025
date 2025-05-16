import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
 @Get('uploads/:folder/:imageName')
  getImage(@Param('folder') folder: string, @Param('imageName') imageName: string, @Res() res) {
    return res.sendFile(join(process.cwd(), 'uploads', folder, imageName));
  }
}