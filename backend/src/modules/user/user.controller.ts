import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

import { JwtAuthGuard} from '../auth/jwt-auth.guard';
import { Request as ReqDecorator } from '@nestjs/common';


@Controller('/api/users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    async create(@Body() data: any): Promise<User[]> {
        return await this.userService.create(data);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }



    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@ReqDecorator() req) {
        return { message: 'Thông tin user đã đăng nhập', user: req.user };
    }

    @Post('reset-password')
    async resetPassword(@Body() data: any): Promise<User | null> {
        return await this.userService.resetPassword(data);
    }
    
}
