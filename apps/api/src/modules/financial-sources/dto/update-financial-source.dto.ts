import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { FinancialSourceStatus } from '../../../common/enums/financial-source-status.enum';
import { ProviderType } from '../../../common/enums/provider-type.enum';

export class UpdateFinancialSourceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  providerName?: string;

  @IsOptional()
  @IsEnum(ProviderType)
  providerType?: ProviderType;

  @IsOptional()
  @IsEnum(FinancialSourceStatus)
  status?: FinancialSourceStatus;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @Matches(/^vault:\/\//, {
    message: 'credentialReference must be a vault reference, not plaintext credentials.',
  })
  credentialReference?: string;
}
