import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FinancialSourceStatus,
  ProviderType,
} from '@dcredit/backend-shared';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class CreateFinancialSourceDto {
  @ApiProperty()
  @IsString()
  providerName!: string;

  @ApiProperty({ enum: ProviderType })
  @IsEnum(ProviderType)
  providerType!: ProviderType;

  @ApiProperty({ enum: FinancialSourceStatus })
  @IsEnum(FinancialSourceStatus)
  status!: FinancialSourceStatus;

  @ApiProperty()
  @IsString()
  @Matches(/^vault:\/\//, {
    message: 'credentialReference must be a secure vault reference.',
  })
  credentialReference!: string;
}

export class UpdateFinancialSourceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  providerName?: string;

  @ApiPropertyOptional({ enum: ProviderType })
  @IsOptional()
  @IsEnum(ProviderType)
  providerType?: ProviderType;

  @ApiPropertyOptional({ enum: FinancialSourceStatus })
  @IsOptional()
  @IsEnum(FinancialSourceStatus)
  status?: FinancialSourceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^vault:\/\//, {
    message: 'credentialReference must be a secure vault reference.',
  })
  credentialReference?: string;
}
