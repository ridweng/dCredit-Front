import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { InstallmentStatus } from '../../../common/enums/installment-status.enum';

export class CreateInstallmentDto {
  @IsNumber()
  installmentNumber!: number;

  @IsDateString()
  dueDate!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  principalPortion?: number | null;

  @IsOptional()
  @IsNumber()
  interestPortion?: number | null;

  @IsEnum(InstallmentStatus)
  status!: InstallmentStatus;
}
