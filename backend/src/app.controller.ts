import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('admin/*')
  serveAdminApp(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'fe-admin', 'build'));
  }

  @Get('*')
  serveApp(@Res() res: Response) {
    // Kiểm tra để không xử lý các API routes
    if (!res.req.url.startsWith('/api') && !res.req.url.startsWith('/uploads')) {
      res.sendFile(join(__dirname, '..', 'public', 'fe-customer', 'build'));
    }
  }
}