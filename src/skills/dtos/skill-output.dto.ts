import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SkillOutputDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;
}
