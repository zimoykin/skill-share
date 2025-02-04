import { Test, TestingModule } from '@nestjs/testing';
import { AdminSettingsService } from './admin-settings.service';

describe('AdminSettingsService', () => {
  let service: AdminSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSettingsService],
    }).compile();

    service = module.get<AdminSettingsService>(AdminSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
