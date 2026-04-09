import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { PreferredLanguage } from '../../../common/enums/preferred-language.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEnum(PreferredLanguage)
  preferredLanguage!: PreferredLanguage;
}
