import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ToppingService } from './topping.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('topping')
export class ToppingController {
    constructor(
        private readonly toppingService: ToppingService
    ) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
        destination: './uploads/images', // thư mục lưu ảnh
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname)); // đặt tên file tránh trùng
        },
        }),
    }))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.filename };
    }

    @Post()
    async create(@Body() toppingData: any) {
        try {
            const topping = await this.toppingService.create(toppingData);
            return {
                message: 'Topping created successfully',
                data: topping,
            };
        } catch (error) {
            return {
                message: 'Error creating topping',
                error: error.message,
            };
        }
    }
}
