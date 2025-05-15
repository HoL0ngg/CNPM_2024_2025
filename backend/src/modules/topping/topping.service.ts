import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topping } from './topping.entity';

@Injectable()
export class ToppingService {
    constructor(
         @InjectRepository(Topping)
        private readonly toppingRepository: Repository<Topping>,
    ) {}
    create(topping: Topping): Promise<Topping> {
        return this.toppingRepository.save(topping);
    }
}
