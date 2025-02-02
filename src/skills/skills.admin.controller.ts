import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillOutputDto } from './dtos/skill-output.dto';
import { plainToInstance } from 'class-transformer';
import { SkillInputDto } from './dtos/skill-input.dto';
// import { AdminAccess } from '@zimoykin/auth';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @AdminAccess()
// @ApiBearerAuth('Authorization')
@Controller('v1/admin/skills')
export class SkillsProtectedController {
  private readonly logger = new Logger(SkillsProtectedController.name);

  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async createSkill(@Body() dto: SkillInputDto): Promise<SkillOutputDto> {
    return this.skillsService
      .createSkill(dto)
      .then((skill) => plainToInstance(SkillOutputDto, skill));
  }
}
