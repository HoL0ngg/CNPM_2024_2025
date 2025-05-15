import { Test, TestingModule } from '@nestjs/testing';
import { ProductToppingService } from './product_topping.service';

describe('ProductToppingService', () => {
  let service: ProductToppingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductToppingService],
    }).compile();

    service = module.get<ProductToppingService>(ProductToppingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
