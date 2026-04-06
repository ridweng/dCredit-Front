import { IsEnum, IsString, MinLength } from 'class-validator';
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
  credentialReference!: string;
}
