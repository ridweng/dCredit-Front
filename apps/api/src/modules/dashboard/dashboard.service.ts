import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Credit } from '../credits/credit.entity';
import { Transaction } from '../transactions/transaction.entity';
import { FinancialInsightsService } from '../shared/financial-insights.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly financialInsightsService: FinancialInsightsService,
  ) {}

  async getLiquidBalance(userId: string) {
    const accounts = await this.accountRepository.find({
      where: { userId },
      relations: { financialSource: true },
      order: { createdAt: 'ASC' },
    });

    return this.financialInsightsService.buildLiquidBalanceSummary(accounts);
  }

  async getWeeklySpending(userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { userId },
      relations: { category: true },
      order: { date: 'ASC' },
    });

    return this.financialInsightsService.buildWeeklySpendingSummary(transactions);
  }

  async getSummary(userId: string) {
    const [accounts, credits, transactions] = await Promise.all([
      this.accountRepository.find({
        where: { userId },
        relations: { financialSource: true },
        order: { createdAt: 'ASC' },
      }),
      this.creditRepository.find({
        where: { userId },
        relations: { installments: true, financialSource: true },
        order: { createdAt: 'ASC' },
      }),
      this.transactionRepository.find({
        where: { userId },
        relations: { category: true },
        order: { date: 'ASC' },
      }),
    ]);

    return {
      overview: {
        accountCount: accounts.length,
        creditCount: credits.length,
        totalOutstandingBalance: credits.reduce(
          (sum, credit) => Math.round((sum + credit.outstandingBalance) * 100) / 100,
          0,
        ),
      },
      liquidBalance: this.financialInsightsService.buildLiquidBalanceSummary(accounts),
      weeklySpending: this.financialInsightsService.buildWeeklySpendingSummary(transactions),
      categorizedSpending:
        this.financialInsightsService.buildCategoryPercentageSummary(transactions),
      creditObligations:
        this.financialInsightsService.buildMonthlyCreditObligations(credits),
    };
  }

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
