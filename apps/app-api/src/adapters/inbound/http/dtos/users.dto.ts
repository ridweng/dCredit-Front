import { ApiProperty } from '@nestjs/swagger';
import { PreferredLanguage } from '@dcredit/backend-shared';
import { IsEnum } from 'class-validator';

export class UpdateCurrentUserDto {
  @ApiProperty({ enum: PreferredLanguage })
  @IsEnum(PreferredLanguage)
  preferredLanguage!: PreferredLanguage;
}
