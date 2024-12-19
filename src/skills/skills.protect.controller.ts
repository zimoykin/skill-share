import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillOutputDto } from './dtos/skill-output.dto';
import { plainToInstance } from 'class-transformer';
import { SkillInputDto } from './dtos/skill-input.dto';

@Controller('v1/admin/skills')
// TODO: protect this endpoint
//@AdminAccess() -> this is how we will protect this endpoint
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
