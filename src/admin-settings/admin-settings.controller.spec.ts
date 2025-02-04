import { Test, TestingModule } from '@nestjs/testing';
import { AdminSettingsController } from './admin-settings.controller';

describe('AdminSettingsController', () => {
  let controller: AdminSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSettingsController],
    }).compile();

    controller = module.get<AdminSettingsController>(AdminSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
