import { IsEnum, IsString, MinLength } from 'class-validator';
import { CategoryType } from '../../../common/enums/category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  key!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(CategoryType)
  type!: CategoryType;
}
