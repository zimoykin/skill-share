import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { AdminAccess } from '@zimoykin/auth';
import { CategoryOutDto } from './dtos/category-out.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryInDto } from './dtos/category-in.dto';

// @AdminAccess()
// @ApiBearerAuth('Authorization')
@Controller('v1/admin/categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly service: CategoriesService) {}

  @Post()
  async createCategory(@Body() dto: CategoryInDto): Promise<CategoryOutDto> {
    return this.service
      .createCategory(dto)
      .then((category) => plainToInstance(CategoryOutDto, category));
  }
}
