import { Test, TestingModule } from '@nestjs/testing';
import { OtpCleanupServiceService } from './otp-cleanup-service.service';

describe('OtpCleanupServiceService', () => {
  let service: OtpCleanupServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpCleanupServiceService],
    }).compile();

    service = module.get<OtpCleanupServiceService>(OtpCleanupServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
