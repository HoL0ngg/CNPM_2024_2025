import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    index(){
        return {
            message: 'Hello from user controller'
        }
    }
}
