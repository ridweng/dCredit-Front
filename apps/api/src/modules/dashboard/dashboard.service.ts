import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getCountsForUser(userId: string): Promise<{
    accounts: number;
    credits: number;
    transactions: number;
  }> {
    const [accounts, credits, transactions] = await Promise.all([
      this.accountRepository.count({ where: { userId } }),
      this.creditRepository.count({ where: { userId } }),
      this.transactionRepository.count({ where: { userId } }),
    ]);

    return { accounts, credits, transactions };
  }
}
