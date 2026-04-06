import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { CreditType } from '../../../common/enums/credit-type.enum';

export class CreateCreditDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(CreditType)
  creditType!: CreditType;

  @IsNumber()
  originalAmount!: number;

  @IsNumber()
  outstandingBalance!: number;

  @IsNumber()
  interestRate!: number;

  @IsNumber()
  monthlyPayment!: number;

  @IsDateString()
  nextPaymentDate!: string;

  @IsOptional()
  @IsDateString()
  deferredPaymentDate?: string | null;

  @IsOptional()
  @IsNumber()
  totalInstallments?: number | null;

  @IsOptional()
  @IsNumber()
  remainingInstallments?: number | null;
}
