// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    // Không dùng JWT tạm thời, trả user về frontend
    const { password: _, ...result } = user;
    return {
    message: 'Đăng nhập thành công', // Thêm trường message
    userData: result
  };
  }
}
