import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';


@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get()
    async findAll() {
        try {
            const products = await this.productService.findAll();
            return {
                message: 'Products fetched successfully',
                data: products,
            };
        } catch (error) {
            return {
                message: 'Error fetching products',
                error: error.message,
            };
        }
    } 

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

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
    async create(@Body() productData: any) {
        try {
            const product = await this.productService.create(productData);
            return {
                message: 'Product created successfully',
                data: product,
            };
        } catch (error) {
            return {
                message: 'Error creating product',
                error: error.message,
            };
        }
    }
}
