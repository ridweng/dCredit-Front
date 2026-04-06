import { User } from '../modules/users/user.entity';
import { VerificationToken } from '../modules/users/verification-token.entity';
import { FinancialSource } from '../modules/financial-sources/financial-source.entity';
import { Account } from '../modules/accounts/account.entity';
import { Category } from '../modules/categories/category.entity';
import { Credit } from '../modules/credits/credit.entity';
import { Installment } from '../modules/credits/installment.entity';
import { Transaction } from '../modules/transactions/transaction.entity';

export const appEntities = [
  User,
  VerificationToken,
  FinancialSource,
  Account,
  Category,
  Credit,
  Installment,
  Transaction,
];
