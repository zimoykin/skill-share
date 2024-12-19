import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class SkillInputDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;
}
