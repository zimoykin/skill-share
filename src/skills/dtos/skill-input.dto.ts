import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SkillInputDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsUUID()
  categoryId: string;
}
