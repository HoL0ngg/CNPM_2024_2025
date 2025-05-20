import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async create(userData: any){
        console.log(userData);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        userData.role = userData.role || 'admin'; 
        userData.status = userData.status || 'Đang hoạt động';
        userData.created_at = new Date();
        
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

    findAll(): Promise<User[]> {    
        return this.userRepository.find();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async resetPassword(data: any): Promise<User | null> {
        const hashedPassword = await bcrypt.hash("1", 10);
        await this.userRepository.update(data.id, { password: hashedPassword });
        return this.userRepository.findOne({ where: { id : data.id } });
    }

    async update(data:any){
        // console.log(data);
        const user = await this.userRepository.findOne({ where: { id: data.id } });
        // console.log(user);
        if (user) {
            user.status = data.status;
            user.role = data.role;
            // console.log(user);
            this.userRepository.save(user);
            return user;
        }
        return null;
    }

    async changePassword(data: any): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id: data.id } });
        if (user) {
            const isMatch = await bcrypt.compare(data.currentPassword, user.password);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(data.newPassword, 10);
                user.password = hashedPassword;
                return this.userRepository.save(user);
            }
        }
        return null;
    }

    async getByUsername(username: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { username: username } });
        if (user) {
            return user;
        }
        return null;
    }
}