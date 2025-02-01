import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryOutDto {
  @Expose()
  id: number;

  @Expose()
  title: string;
}
