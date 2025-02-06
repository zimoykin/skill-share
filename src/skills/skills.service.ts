import { Injectable, Logger } from '@nestjs/common';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ISkill } from './interfaces/skill.interface';
import { SkillInputDto } from './dtos/skill-input.dto';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  /**
   * Retrieves a list of skills.
   * @returns {Promise<Array<Skill>>} A promise that resolves to an array of skills,
   * including their associated categories.
   */

  async getSkills(): Promise<Array<Skill>> {
    this.logger.debug('getting skills');
    return this.skillsRepository.find({ relations: ['category'] }) ?? [];
  }
  async getSkillById(id: string) {
    this.logger.debug('getting skill by id');
    return this.skillsRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
  }

  //admins only
  async updateSkillById(id: string, dto: SkillInputDto) {
    this.logger.debug(`updating skill by id: ` + id);
    const skill = await this.skillsRepository.findOne({ where: { id: id } });
    if (!skill) {
      throw new Error('Skill not found');
    }
    return this.skillsRepository.save({
      ...dto,
      id: skill.id,
      category: { id: skill.category.id },
    });
  }
  async createSkill(dto: ISkill, userId: string): Promise<Skill> {
    this.logger.debug('creating skill');
    const newSkill = this.skillsRepository.create({
      title: dto.title,
      description: dto.description,
      image: dto.image,
      user: { id: userId },
      category: { id: dto.categoryId },
    });
    return this.skillsRepository.save(newSkill);
  }

  async deleteSkill(skillId: string): Promise<void> {
    this.logger.debug('deleting skill');
    await this.skillsRepository.delete({ id: skillId });
  }
}
