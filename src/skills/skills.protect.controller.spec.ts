import { Test, TestingModule } from '@nestjs/testing';
import { SkillsProtectedController } from './skills.protect.controller';

describe('SkillsProtectController', () => {
  let controller: SkillsProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsProtectedController],
    }).compile();

    controller = module.get<SkillsProtectedController>(
      SkillsProtectedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
