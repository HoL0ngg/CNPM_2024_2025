import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { stat } from 'fs';


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
    async create(@Body() data: any) {
        try {
            const product = await this.productService.create(data);
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

    @Put()
    async update(@Body() data: any) {
        try {
            const product = await this.productService.update(data);
            return {
                message: 'Product updated successfully',
                data: product,
            };
        } catch (error) {
            return {
                message: 'Error updating product',
                error: error.message,
            };
        }
    }

    @Post('remove')
    async remove(@Body() data: any) {
        try {
            await this.productService.remove(data.id);
            return {
                message: 'Product deleted successfully',
                status: true,
            };
        } catch (error) {
            return {
                message: 'Error deleting product',
                error: error.message,
                status: false,
            };
        }
    }
    
}
