import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsDateString()
  date!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsNumber()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsOptional()
  @IsString()
  merchant?: string | null;
}
