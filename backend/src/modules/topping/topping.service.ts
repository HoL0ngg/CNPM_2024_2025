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

    getAll(): Promise<Topping[]> {
        return this.toppingRepository.find();
    }

    async delete(id: number): Promise<void> {
        await this.toppingRepository.delete(id);
    }

    async update(data: any): Promise<Topping> {
        const topping = await this.toppingRepository.findOneBy({ id: data.id });
        if (!topping) {
            throw new Error('Topping not found');
        }
        topping.name = data.name;
        topping.price = data.price;
        topping.image = data.image;
        topping.quantity = data.quantity;
        return this.toppingRepository.save(topping);
    }
}
