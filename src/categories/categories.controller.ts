import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryOutDto } from './dtos/category-out.dto';
import { plainToInstance } from 'class-transformer';
import { JWTGuard } from '../github/jwt.guard';
import { CategoryInDto } from './dtos/category-in.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { IAuthUser } from 'src/auth/interfaces/user.interface';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { AdminAccess } from 'src/github/admin.guard';

@UseGuards(JWTGuard)
@Controller('v1/categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);
  constructor(private readonly service: CategoriesService) {}

  @Get()
  async getAll(): Promise<CategoryOutDto[]> {
    return this.service.getAll().then((categories) => {
      return categories.map((cat) => plainToInstance(CategoryOutDto, cat));
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<CategoryOutDto> {
    return this.service.getOne(id).then((category) => {
      return plainToInstance(CategoryOutDto, category);
    });
  }

  @Post()
  @UseGuards(AdminAccess)
  async createCategory(
    @AuthUser() user: IAuthUser,
    @Body() dto: CategoryInDto,
  ): Promise<CategoryOutDto> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }

    return this.service
      .createCategory(dto)
      .then((category) => {
        return plainToInstance(CategoryOutDto, category);
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  @Put(':id')
  @UseGuards(AdminAccess)
  async updateCategory(
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
    @Body() dto: CategoryInDto,
  ): Promise<CategoryOutDto> {
    return this.service
      .updateCategoryById(id, dto)
      .then((category) => {
        return plainToInstance(CategoryOutDto, category);
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }
}
