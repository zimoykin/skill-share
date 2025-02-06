import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillOutputDto } from './dtos/skill-output.dto';
import { plainToInstance } from 'class-transformer';
import { JWTGuard } from '../github/jwt.guard';
import { SkillInputDto } from './dtos/skill-input.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { IAuthUser } from '../auth/interfaces/user.interface';
import { AdminAccess } from '../github/admin.guard';

@UseGuards(JWTGuard)
@Controller('v1/skills')
export class SkillsController {
  private readonly logger = new Logger(SkillsController.name);
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  /**
   * Retrieves a list of all skills.
   * @returns A promise that resolves to an array of SkillOutputDto objects.
   */
  async getSkills(): Promise<Array<SkillOutputDto>> {
    this.logger.debug('getting skills from service');
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

  @Get(':id')
  /**
   * Retrieves a skill by id.
   *
   * @param id The ID of the skill to retrieve.
   * @returns A promise that resolves to the skill as a SkillOutputDto.
   * @throws Error if the skill is not found.
   */
  async getSkillById(@Param('id') id: string): Promise<SkillOutputDto> {
    this.logger.debug('getting skills from service');
    return this.skillsService
      .getSkillById(id)
      .then((skill) => plainToInstance(SkillOutputDto, skill))
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  /**
   * Creates a new skill based on the provided SkillInputDto.
   *
   * This method is restricted to users with the ADMIN role.
   * If the user is not authenticated or does not have the ADMIN role,
   * a ForbiddenException is thrown.
   *
   * @param dto The data transfer object containing the details of the skill to be created.
   * @param user The authenticated user making the request.
   * @returns A promise that resolves to the created skill as a SkillOutputDto.
   * @throws ForbiddenException if the user is not authenticated or does not have the ADMIN role.
   */
  @Post()
  @UseGuards(AdminAccess)
  async createSkill(
    @Body() dto: SkillInputDto,
    @AuthUser() user: IAuthUser,
  ): Promise<SkillOutputDto> {
    return this.skillsService
      .createSkill(dto, user.id)
      .then((skill) => plainToInstance(SkillOutputDto, skill))
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  @Put(':id')
  @UseGuards(AdminAccess)
  /**
   * Updates a skill with the specified ID based on the provided SkillInputDto.
   *
   * This method is restricted to users with the ADMIN role.
   * If the user is not authenticated or does not have the ADMIN role,
   * a ForbiddenException is thrown.
   *
   * @param id The ID of the skill to be updated.
   * @param dto The data transfer object containing the changes to apply to the skill.
   * @returns A promise that resolves to the updated skill as a SkillOutputDto.
   * @throws ForbiddenException if the user is not authenticated or does not have the ADMIN role.
   */
  async updateSkill(
    @Param('id') id: string,
    @Body() dto: SkillInputDto,
  ): Promise<SkillOutputDto> {
    return this.skillsService
      .updateSkillById(id, dto)
      .then((skill) => plainToInstance(SkillOutputDto, skill))
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  /**
   * Deletes a skill with the specified ID. (admin access only)
   *
   * This method is restricted to users with the ADMIN role.
   * If the user is not authenticated or does not have the ADMIN role,
   * a ForbiddenException is thrown.
   *
   * @param user The authenticated user making the request.
   * @param skillId The ID of the skill to be deleted.
   * @throws ForbiddenException if the user is not authenticated or does not have the ADMIN role.
   */
  @Delete(':id')
  @UseGuards(AdminAccess)
  async deleteSkill(
    @AuthUser() user: IAuthUser,
    @Param('id') skillId: string,
  ): Promise<void> {
    return this.skillsService.deleteSkill(skillId).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }
}
