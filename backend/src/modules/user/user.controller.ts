import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
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
    async create(@Body() data: any){
       try {
         await this.userService.create(data);
         return{
            message: 'Tạo tài khoản thành công',
            status: true
         }
        } catch (error) {
            return {
                message: 'Tạo tài khoản không thành công',
                status: false
            }
       }
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
    async resetPassword(@Body() data: any){
        try {
            const user = await this.userService.resetPassword(data);
            if(user) {
                return {
                    message: 'Khôi phục thành công',
                    user: user,
                    status: true
                }
            }
        }
        catch (error) {
            return {
                message: 'Khôi phục không thành công',
                status: false
            }
        }
    }
 
    @Put()
    async update(@Body() data: any){
        try {
            console.log("controller", data);
            const user = await this.userService.update(data);
            if(user) {
                return {
                    message: 'Cập nhật thành công',
                    user: user,
                    status: true
                }
            }
        }
        catch (error) {
            return {
                message: 'Cập nhật không thành công',
                status: false
            }
        }
    }

    @Post('change-password')
    async changePassword(@Body() data: any){
        try {
            console.log("controller", data);    
            const user = await this.userService.changePassword(data);
            if(user) {
                return {
                    message: 'Đổi mật khẩu thành công',
                    user: user,
                    status: true
                }
            }
        }
        catch (error) {
            return {
                message: 'Đổi mật khẩu không thành công',
                status: false
            }
        }
    }

    @Post('username')
    async getByUsername(@Body() data: any){
        try {
            const user = await this.userService.findByUsername(data.username);
            if(user) {
                return {
                    message: 'Tài khoản đã tồn tại',
                    user: user,
                    status: true
                }
            }
        }
        catch (error) {
            return {
                message: 'Tìm tài khoản không thành công',
                status: false
            }
        }
    }
}
