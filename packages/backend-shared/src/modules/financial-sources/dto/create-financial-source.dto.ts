import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { FinancialSourceStatus } from '../../../common/enums/financial-source-status.enum';
import { ProviderType } from '../../../common/enums/provider-type.enum';

export class CreateFinancialSourceDto {
  @IsString()
  @MinLength(2)
  providerName!: string;

  @IsEnum(ProviderType)
  providerType!: ProviderType;

  @IsEnum(FinancialSourceStatus)
  status!: FinancialSourceStatus;

  @IsString()
  @MinLength(3)
  @Matches(/^vault:\/\//, {
    message: 'credentialReference must be a vault reference, not plaintext credentials.',
  })
  credentialReference!: string;
}
