import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CategoryInDto {
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
