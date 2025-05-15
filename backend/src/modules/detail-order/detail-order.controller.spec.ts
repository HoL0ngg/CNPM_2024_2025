import { Test, TestingModule } from '@nestjs/testing';
import { DetailOrderController } from './detail-order.controller';

describe('DetailOrderController', () => {
  let controller: DetailOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailOrderController],
    }).compile();

    controller = module.get<DetailOrderController>(DetailOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
