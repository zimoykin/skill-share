import { Injectable, Logger } from '@nestjs/common';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  /**
   * Retrieves a list of skills.
   * @returns {Promise<any[]>} A promise that resolves to an array of skills.
   */
  async getSkills(): Promise<Array<Skill>> {
    this.logger.debug('getting skills');
    return this.skillsRepository.find() ?? [];
  }

  //admins only
  async createSkill(dto: Partial<Skill>): Promise<Skill> {
    this.logger.debug('creating skill');
    const newSkill = this.skillsRepository.create(dto);
    return this.skillsRepository.save(newSkill);
  }
}
