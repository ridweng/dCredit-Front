import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PreferredLanguage } from '../../../common/enums/preferred-language.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsEnum(PreferredLanguage)
  preferredLanguage?: PreferredLanguage;
}
