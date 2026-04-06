import { IsEnum, IsOptional } from 'class-validator';
import { PreferredLanguage } from '../../../common/enums/preferred-language.enum';

export class UpdateCurrentUserDto {
  @IsOptional()
  @IsEnum(PreferredLanguage)
  preferredLanguage?: PreferredLanguage;
}
