import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryOutDto } from './dtos/category-out.dto';
import { plainToInstance } from 'class-transformer';
import { GHAuthGuard } from 'src/github/github.guard';

@UseGuards(GHAuthGuard)
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
}
