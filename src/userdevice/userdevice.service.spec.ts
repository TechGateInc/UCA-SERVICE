import { Test, TestingModule } from '@nestjs/testing';
import { UserdeviceService } from './userdevice.service';

describe('UserdeviceService', () => {
  let service: UserdeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserdeviceService],
    }).compile();

    service = module.get<UserdeviceService>(UserdeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
