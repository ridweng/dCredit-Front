import { IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { AccountType } from '../../../common/enums/account-type.enum';

export class CreateAccountDto {
  @IsString()
  @MinLength(2)
  accountName!: string;

  @IsEnum(AccountType)
  accountType!: AccountType;

  @IsString()
  @MinLength(3)
  currency!: string;

  @IsNumber()
  currentBalance!: number;

  @IsOptional()
  @IsNumber()
  availableBalance?: number;
}
