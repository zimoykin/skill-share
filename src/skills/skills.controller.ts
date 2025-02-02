import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillOutputDto } from './dtos/skill-output.dto';
import { plainToInstance } from 'class-transformer';
import { GHAuthGuard } from 'src/github/github.guard';

@UseGuards(GHAuthGuard)
@Controller('v1/skills')
export class SkillsController {
  private readonly logger = new Logger(SkillsController.name);
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getSkills(): Promise<Array<SkillOutputDto>> {
    this.logger.debug('getSkills');
    return this.skillsService
      .getSkills()
      .then((skills) =>
        skills.map((skill) => plainToInstance(SkillOutputDto, skill)),
      )
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }
}
