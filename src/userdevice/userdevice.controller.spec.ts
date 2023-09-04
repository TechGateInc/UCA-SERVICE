import { Test, TestingModule } from '@nestjs/testing';
import { UserdeviceController } from './userdevice.controller';

describe('UserdeviceController', () => {
  let controller: UserdeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserdeviceController],
    }).compile();

    controller = module.get<UserdeviceController>(UserdeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
