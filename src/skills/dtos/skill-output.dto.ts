import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CategoryOutDto } from 'src/categories/dtos/category-out.dto';

@Exclude()
export class SkillOutputDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CategoryOutDto)
  @ValidateNested()
  category: CategoryOutDto;

  @Expose()
  image?: string;
}
