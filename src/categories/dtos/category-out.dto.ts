import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryOutDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;
}
