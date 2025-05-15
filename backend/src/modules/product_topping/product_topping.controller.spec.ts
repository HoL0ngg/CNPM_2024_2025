import { Test, TestingModule } from '@nestjs/testing';
import { ProductToppingController } from './product_topping.controller';

describe('ProductToppingController', () => {
  let controller: ProductToppingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductToppingController],
    }).compile();

    controller = module.get<ProductToppingController>(ProductToppingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
